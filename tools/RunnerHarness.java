import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintStream;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.lang.reflect.Method;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import javax.tools.Diagnostic;
import javax.tools.DiagnosticCollector;
import javax.tools.FileObject;
import javax.tools.ForwardingJavaFileManager;
import javax.tools.JavaCompiler;
import javax.tools.JavaFileManager;
import javax.tools.JavaFileObject;
import javax.tools.SimpleJavaFileObject;
import javax.tools.ToolProvider;

/**
 * Runs inside CheerpJ (Java 8 runtime + bundled tools.jar).
 * Compiles /str/Main.java fully in memory (no classpath juggling), then
 * invokes Main.main() with stdin from /str/input.txt while capturing
 * stdout/stderr. Writes everything to /files/work/result.txt:
 *
 *   CSTATUS:<0 ok | 1 compile error>
 *   CLOG:<compile diagnostics>
 *   ESTATUS:<0 ok | 1 program threw>
 *   <captured program output>
 */
public class RunnerHarness {

    static class SourceFile extends SimpleJavaFileObject {
        private final String src;
        SourceFile(String name, String src) {
            super(URI.create("string:///" + name.replace('.', '/') + Kind.SOURCE.extension), Kind.SOURCE);
            this.src = src;
        }
        public CharSequence getCharContent(boolean ignoreEncodingErrors) { return src; }
    }

    static class ClassBytes extends SimpleJavaFileObject {
        private final Map<String, byte[]> store;
        private final String className;
        ClassBytes(String className, Map<String, byte[]> store) {
            super(URI.create("bytes:///" + className.replace('.', '/')), Kind.CLASS);
            this.className = className;
            this.store = store;
        }
        public OutputStream openOutputStream() {
            return new ByteArrayOutputStream() {
                public void close() {
                    store.put(className, toByteArray());
                }
            };
        }
    }

    static class MemLoader extends ClassLoader {
        private final Map<String, byte[]> classes;
        MemLoader(ClassLoader parent, Map<String, byte[]> classes) {
            super(parent);
            this.classes = classes;
        }
        protected Class<?> findClass(String name) throws ClassNotFoundException {
            byte[] b = classes.get(name);
            if (b == null) throw new ClassNotFoundException(name);
            return defineClass(name, b, 0, b.length);
        }
    }

    public static void main(String[] args) throws Exception {
        Thread watchdog = new Thread(() -> {
            try { Thread.sleep(15000); } catch (InterruptedException ignored) {}
            Runtime.getRuntime().halt(137);
        });
        watchdog.setDaemon(true);
        watchdog.start();

        String source;
        try { source = new String(Files.readAllBytes(Paths.get("/str/Main.java")), StandardCharsets.UTF_8); }
        catch (Exception e) { source = ""; }
        byte[] input;
        try { input = Files.readAllBytes(Paths.get("/str/input.txt")); }
        catch (Exception e) { input = new byte[0]; }

        StringBuilder log = new StringBuilder();

        // ---------- compile ----------
        Map<String, byte[]> compiled = new HashMap<String, byte[]>();
        int cstatus;
        String clog;
        try {
            JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();
            if (compiler == null) {
                cstatus = 1;
                clog = "No system java compiler available";
            } else {
                DiagnosticCollector<JavaFileObject> diags = new DiagnosticCollector<JavaFileObject>();
                final JavaFileManager baseFm = compiler.getStandardFileManager(diags, null, null);
                JavaFileManager memFm = new ForwardingJavaFileManager<JavaFileManager>(baseFm) {
                    public JavaFileObject getJavaFileForOutput(Location location, final String className,
                            JavaFileObject.Kind kind, FileObject sibling) throws IOException {
                        return new ClassBytes(className, compiled);
                    }
                };
                JavaCompiler.CompilationTask task = compiler.getTask(null, memFm, diags,
                        Arrays.asList(new String[] { "-nowarn" }), null,
                        Arrays.asList(new JavaFileObject[] { new SourceFile("Main", source) }));
                Boolean ok = task.call();

                StringBuilder d = new StringBuilder();
                for (Diagnostic<? extends JavaFileObject> diag : diags.getDiagnostics()) {
                    d.append(diag.getKind()).append(' ');
                    if (diag.getSource() != null) d.append(diag.getSource().getName());
                    d.append(':').append(diag.getLineNumber()).append(' ')
                     .append(diag.getMessage(null)).append('\n');
                }
                clog = d.toString().trim();
                cstatus = (Boolean.TRUE.equals(ok) && compiled.containsKey("Main")) ? 0 : 1;
                try { baseFm.close(); } catch (IOException ignored) {}
            }
        } catch (Throwable t) {
            cstatus = 1;
            StringWriter sw = new StringWriter();
            t.printStackTrace(new PrintWriter(sw));
            clog = sw.toString();
        }

        // ---------- run ----------
        int estatus = 0;
        PrintStream origOut = System.out;
        PrintStream origErr = System.err;
        ByteArrayOutputStream buf = new ByteArrayOutputStream();
        PrintStream cap = new PrintStream(buf, true, "UTF-8");

        if (cstatus == 0) {
            System.setOut(cap);
            System.setErr(cap);
            try {
                System.setIn(new ByteArrayInputStream(input));
                MemLoader loader = new MemLoader(RunnerHarness.class.getClassLoader(), compiled);
                Class<?> cls = loader.loadClass("Main");
                Method m = cls.getDeclaredMethod("main", String[].class);
                m.setAccessible(true);
                m.invoke(null, (Object) new String[0]);
                cap.flush();
            } catch (Throwable t) {
                t.printStackTrace(cap);
                estatus = 1;
            } finally {
                System.setOut(origOut);
                System.setErr(origErr);
                watchdog.interrupt();
            }
        } else {
            watchdog.interrupt();
        }

        String payload = "CSTATUS:" + cstatus + "\n"
            + "CLOG:" + clog.replace("\n", "\u0001") + "\n"
            + "ESTATUS:" + estatus + "\n"
            + buf.toString("UTF-8");
        Files.createDirectories(Paths.get("/files/work"));
        Files.write(Paths.get("/files/work/result.txt"), payload.getBytes(StandardCharsets.UTF_8));
        log.append("done");
        System.exit(0);
    }
}
