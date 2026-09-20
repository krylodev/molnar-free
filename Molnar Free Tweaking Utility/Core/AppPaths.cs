using System.Text.Json;

namespace Molnar_Free_Tweaking_Utility.Core
{
    public static class AppPaths
    {
        public static readonly string Data = Create(Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "Molnar"));

        public static readonly string Backups = Create(Path.Combine(Data, "Backups"));

        private static string Create(string path)
        {
            Directory.CreateDirectory(path);
            return path;
        }
    }

    public static class JsonOptions
    {
        public static readonly JsonSerializerOptions Indented = new() { WriteIndented = true };
    }
}
