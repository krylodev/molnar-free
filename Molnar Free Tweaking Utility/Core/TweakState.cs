using System.Text.Json;

namespace Molnar_Free_Tweaking_Utility.Core
{
    public static class TweakState
    {
        private static readonly string File = Path.Combine(AppPaths.Data, "state.json");
        private static readonly Dictionary<string, bool> Entries = Load();

        public static bool Get(string id) => Entries.TryGetValue(id, out bool value) && value;

        public static void Set(string id, bool value)
        {
            Entries[id] = value;
            Save();
        }

        private static Dictionary<string, bool> Load()
        {
            try
            {
                if (System.IO.File.Exists(File))
                    return JsonSerializer.Deserialize<Dictionary<string, bool>>(System.IO.File.ReadAllText(File)) ?? [];
            }
            catch (Exception) { }
            return [];
        }

        private static void Save()
        {
            try { System.IO.File.WriteAllText(File, JsonSerializer.Serialize(Entries, JsonOptions.Indented)); }
            catch (Exception) { }
        }
    }
}
