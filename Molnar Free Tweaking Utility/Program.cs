using Molnar_Free_Tweaking_Utility.Core;

namespace Molnar_Free_Tweaking_Utility
{
    internal static class Program
    {
        [STAThread]
        static void Main(string[] args)
        {
            Application.SetUnhandledExceptionMode(UnhandledExceptionMode.CatchException);
            Application.ThreadException += (_, e) => Log(e.Exception);
            AppDomain.CurrentDomain.UnhandledException += (_, e) => Log(e.ExceptionObject as Exception);
            ApplicationConfiguration.Initialize();

            var form = new Main();
            string? page = args.SkipWhile(a => a != "--page").Skip(1).FirstOrDefault();
            if (page is not null) form.Shown += (_, _) => form.BeginInvoke(() => form.OpenPage(page));

            Application.Run(form);
        }

        private static void Log(Exception? exception)
        {
            if (exception is null) return;
            try { File.AppendAllText(Path.Combine(AppPaths.Data, "errors.log"), $"{DateTime.Now:s}  {exception}\n\n"); }
            catch (Exception) { }
        }
    }
}
