using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Win32;

namespace Molnar_Free_Tweaking_Utility.Core
{
    public sealed class Settings
    {
        private static readonly string File = Path.Combine(AppPaths.Data, "settings.json");

        [JsonPropertyName("backupBeforeApply")] public bool BackupBeforeApply { get; set; } = true;
        [JsonPropertyName("confirmWarnings")] public bool ConfirmWarnings { get; set; } = true;
        [JsonPropertyName("startWithWindows")] public bool StartWithWindows { get; set; }

        public static Settings Current { get; } = Load();

        public void Save()
        {
            try { System.IO.File.WriteAllText(File, JsonSerializer.Serialize(this, JsonOptions.Indented)); }
            catch (Exception) { }
        }

        public void ApplyStartup()
        {
            const string path = @"Software\Microsoft\Windows\CurrentVersion\Run";
            using var key = Registry.CurrentUser.CreateSubKey(path, true);
            if (key is null) return;

            if (StartWithWindows) key.SetValue("Molnar", $"\"{Environment.ProcessPath}\"");
            else key.DeleteValue("Molnar", false);
        }

        private static Settings Load()
        {
            try
            {
                if (System.IO.File.Exists(File))
                    return JsonSerializer.Deserialize<Settings>(System.IO.File.ReadAllText(File)) ?? new Settings();
            }
            catch (Exception) { }
            return new Settings();
        }
    }
}
