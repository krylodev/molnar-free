using System.Text.Json;
using System.Text.Json.Serialization;

namespace Molnar_Free_Tweaking_Utility.Core
{
    public sealed class BackupEntry
    {
        [JsonPropertyName("path")] public string Path { get; set; } = "";
        [JsonPropertyName("name")] public string Name { get; set; } = "";
        [JsonPropertyName("type")] public string Type { get; set; } = "";
        [JsonPropertyName("data")] public string? Data { get; set; }
    }

    public sealed class Backup
    {
        [JsonPropertyName("created")] public DateTime Created { get; set; }
        [JsonPropertyName("machine")] public string Machine { get; set; } = "";
        [JsonPropertyName("entries")] public List<BackupEntry> Entries { get; set; } = [];

        [JsonIgnore] public string FilePath { get; set; } = "";
        [JsonIgnore] public string Label => $"{Created:dd MMM yyyy  HH:mm}  ·  {Entries.Count} values";
    }

    public static class BackupService
    {
        public static Backup Create()
        {
            var backup = new Backup { Created = DateTime.Now, Machine = Environment.MachineName };
            var seen = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

            foreach (var op in TweakCatalog.Tweaks.SelectMany(t => t.Apply.Concat(t.Revert)))
            {
                if (op.Kind is not ("regset" or "regdel")) continue;
                if (!seen.Add($"{op.Path}\\\\{op.Value}")) continue;

                object? current = RegistryPath.Read(op.Path, op.Value);
                backup.Entries.Add(new BackupEntry
                {
                    Path = op.Path,
                    Name = op.Value,
                    Type = op.ValueType.Length > 0 ? op.ValueType : "string",
                    Data = Serialize(current)
                });
            }

            backup.FilePath = System.IO.Path.Combine(AppPaths.Backups, $"{backup.Created:yyyy-MM-dd_HH-mm-ss}.json");
            File.WriteAllText(backup.FilePath, JsonSerializer.Serialize(backup, JsonOptions.Indented));
            return backup;
        }

        public static IEnumerable<Backup> List()
        {
            foreach (string file in Directory.EnumerateFiles(AppPaths.Backups, "*.json").OrderDescending())
            {
                Backup? backup = null;
                try { backup = JsonSerializer.Deserialize<Backup>(File.ReadAllText(file)); }
                catch (Exception) { }

                if (backup is null) continue;
                backup.FilePath = file;
                yield return backup;
            }
        }

        public static int Restore(Backup backup)
        {
            int restored = 0;
            foreach (var entry in backup.Entries)
            {
                try
                {
                    if (!RegistryPath.TrySplit(entry.Path, out var root, out var sub)) continue;
                    using (root)
                    {
                        if (entry.Data is null)
                        {
                            using var key = root.OpenSubKey(sub, true);
                            key?.DeleteValue(entry.Name, false);
                        }
                        else
                        {
                            using var key = root.CreateSubKey(sub, true);
                            key?.SetValue(entry.Name, RegistryPath.Convert(entry.Type, entry.Data), RegistryPath.KindOf(entry.Type));
                        }
                    }
                    restored++;
                }
                catch (Exception) { }
            }

            TweakCatalog.Refresh();
            return restored;
        }

        public static void Delete(Backup backup)
        {
            try { File.Delete(backup.FilePath); } catch (Exception) { }
        }

        private static string? Serialize(object? value) => value switch
        {
            null => null,
            byte[] bytes => Convert.ToHexString(bytes),
            string[] lines => string.Join('\0', lines),
            _ => value.ToString()
        };
    }
}
