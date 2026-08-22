import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;

/**
 * Runs inside CheerpJ (Java 8 runtime). Invokes the bundled JDK 8 javac
 * programmatically and captures all diagnostics into
 * /files/work/compile.log (first line = "STATUS:<exit>") so JavaScript can
 * read them reliably via cjFileBlob.
 */
public class CompileHarness {
    public static void main(String[] args) throws Exception {
        java.io.ByteArrayOutputStream bufOut = new java.io.ByteArrayOutputStream();
        PrintWriter pwOut = new PrintWriter(bufOut, true);

        int status;
        try {
            status = com.sun.tools.javac.Main.compile(args, pwOut);
        } catch (Throwable t) {
            t.printStackTrace(pwOut);
            status = 2;
        }

        String diag = "STATUS:" + status + "\n" + bufOut.toString("UTF-8");
        Files.createDirectories(Paths.get("/files/work"));
        Files.write(Paths.get("/files/work/compile.log"), diag.getBytes(StandardCharsets.UTF_8));
    }
}
