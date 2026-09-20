using Microsoft.Win32;

namespace Molnar_Free_Tweaking_Utility.Core
{
    public static class RegistryPath
    {
        public static bool TrySplit(string path, out RegistryKey root, out string subKey)
        {
            root = Registry.CurrentUser;
            subKey = "";
            if (string.IsNullOrWhiteSpace(path)) return false;

            int slash = path.IndexOf('\\');
            string hive = slash < 0 ? path : path[..slash];
            subKey = slash < 0 ? "" : path[(slash + 1)..];

            RegistryHive? target = hive.ToUpperInvariant() switch
            {
                "HKLM" or "HKEY_LOCAL_MACHINE" => RegistryHive.LocalMachine,
                "HKCU" or "HKEY_CURRENT_USER" => RegistryHive.CurrentUser,
                "HKCR" or "HKEY_CLASSES_ROOT" => RegistryHive.ClassesRoot,
                "HKU" or "HKEY_USERS" => RegistryHive.Users,
                "HKCC" or "HKEY_CURRENT_CONFIG" => RegistryHive.CurrentConfig,
                _ => null
            };

            if (target is null) return false;
            root = RegistryKey.OpenBaseKey(target.Value, RegistryView.Registry64);
            return true;
        }

        public static RegistryValueKind KindOf(string type) => type switch
        {
            "dword" => RegistryValueKind.DWord,
            "qword" => RegistryValueKind.QWord,
            "binary" => RegistryValueKind.Binary,
            "expand" => RegistryValueKind.ExpandString,
            "multi" => RegistryValueKind.MultiString,
            _ => RegistryValueKind.String
        };

        public static object Convert(string type, string data) => type switch
        {
            "dword" => ParseInt(data),
            "qword" => ParseLong(data),
            "binary" => ParseHex(data),
            "multi" => data.Split('\0', StringSplitOptions.RemoveEmptyEntries),
            _ => data
        };

        public static object? Read(string path, string name)
        {
            if (!TrySplit(path, out var root, out var sub)) return null;
            using (root)
            using (var key = root.OpenSubKey(sub))
                return key?.GetValue(name);
        }

        private static int ParseInt(string s)
        {
            s = s.Trim();
            if (s.StartsWith("0x", StringComparison.OrdinalIgnoreCase))
                return int.Parse(s[2..], System.Globalization.NumberStyles.HexNumber);
            return int.TryParse(s, out int v) ? v : 0;
        }

        private static long ParseLong(string s)
        {
            s = s.Trim();
            if (s.StartsWith("0x", StringComparison.OrdinalIgnoreCase))
                return long.Parse(s[2..], System.Globalization.NumberStyles.HexNumber);
            return long.TryParse(s, out long v) ? v : 0;
        }

        private static byte[] ParseHex(string s)
        {
            s = s.Replace(" ", "").Replace(",", "");
            if (s.Length % 2 != 0) s = "0" + s;
            byte[] bytes = new byte[s.Length / 2];
            for (int i = 0; i < bytes.Length; i++)
                bytes[i] = System.Convert.ToByte(s.Substring(i * 2, 2), 16);
            return bytes;
        }
    }
}
