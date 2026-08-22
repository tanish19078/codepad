import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;

/**
 * Runs inside CheerpJ. Invokes the Eclipse batch compiler programmatically,
 * captures all diagnostics into /files/work/compile.log (first line = status)
 * so JavaScript can read them reliably via cjFileBlob.
 */
public class CompileHarness {
    public static void main(String[] args) throws Exception {
        java.io.ByteArrayOutputStream bufOut = new java.io.ByteArrayOutputStream();
        java.io.ByteArrayOutputStream bufErr = new java.io.ByteArrayOutputStream();
        PrintWriter pwOut = new PrintWriter(bufOut, true);
        PrintWriter pwErr = new PrintWriter(bufErr, true);

        boolean ok;
        try {
            org.eclipse.jdt.internal.compiler.batch.Main compiler =
                new org.eclipse.jdt.internal.compiler.batch.Main(pwOut, pwErr, false);
            ok = compiler.compile(args);
        } catch (Throwable t) {
            t.printStackTrace(pwErr);
            ok = false;
        }

        String diag = "STATUS:" + (ok ? 0 : 1) + "\n"
            + bufOut.toString("UTF-8") + bufErr.toString("UTF-8");
        Files.createDirectories(Paths.get("/files/work"));
        Files.write(Paths.get("/files/work/compile.log"), diag.getBytes(StandardCharsets.UTF_8));
        System.exit(ok ? 0 : 1);
    }
}
