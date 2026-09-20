using System.Diagnostics;
using Microsoft.Win32;

namespace Molnar_Free_Tweaking_Utility.Core
{
    public static class TweakEngine
    {
        private const string DisplayClass = @"SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}";

        public static bool IsApplied(Tweak tweak)
        {
            if (tweak.Detect is null) return TweakState.Get(tweak.Id);
            object? current = RegistryPath.Read(tweak.Detect.Path, tweak.Detect.Value);
            if (current is null) return false;
            return Equal(current, tweak.Detect);
        }

        public static TweakResult Run(Tweak tweak, bool apply)
        {
            var result = new TweakResult();
            foreach (var op in apply ? tweak.Apply : tweak.Revert)
            {
                try
                {
                    Execute(op);
                    result.Succeeded++;
                }
                catch (Exception ex)
                {
                    result.Failed++;
                    result.Errors.Add($"{op.Kind} {op.Path}{op.FileName}: {ex.Message}");
                }
            }
            TweakState.Set(tweak.Id, apply);
            return result;
        }

        private static void Execute(TweakOperation op)
        {
            switch (op.Kind)
            {
                case "regset": RegSet(op.Path, op.Value, op.ValueType, op.Data); break;
                case "regdel": RegDelete(op.Path, op.Value); break;
                case "regclear": RegClear(op.Path); break;
                case "regdelkey": RegDeleteKey(op.Path); break;
                case "gpuset": GpuSet(op); break;
                case "delfile": DeleteFiles(op); break;
                case "deldir": DeleteDirectory(op.Path); break;
                case "kill": Kill(op.Path); break;
                case "exec": Exec(op); break;
            }
        }

        private static void RegSet(string path, string name, string type, string data)
        {
            if (!RegistryPath.TrySplit(path, out var root, out var sub)) return;
            using (root)
            using (var key = root.CreateSubKey(sub, true))
                key?.SetValue(name, RegistryPath.Convert(type, data), RegistryPath.KindOf(type));
        }

        private static void RegDelete(string path, string name)
        {
            if (!RegistryPath.TrySplit(path, out var root, out var sub)) return;
            using (root)
            using (var key = root.OpenSubKey(sub, true))
                key?.DeleteValue(name, false);
        }

        private static void RegClear(string path)
        {
            if (!RegistryPath.TrySplit(path, out var root, out var sub)) return;
            using (root)
            using (var key = root.OpenSubKey(sub, true))
            {
                if (key is null) return;
                foreach (string name in key.GetValueNames()) key.DeleteValue(name, false);
            }
        }

        private static void RegDeleteKey(string path)
        {
            if (!RegistryPath.TrySplit(path, out var root, out var sub)) return;
            using (root) root.DeleteSubKeyTree(sub, false);
        }

        private static void GpuSet(TweakOperation op)
        {
            using var root = RegistryKey.OpenBaseKey(RegistryHive.LocalMachine, RegistryView.Registry64);
            using var container = root.OpenSubKey(DisplayClass);
            if (container is null) return;

            foreach (string name in container.GetSubKeyNames())
            {
                if (!name.All(char.IsDigit)) continue;
                using var adapter = container.OpenSubKey(name, true);
                if (adapter is null) continue;

                string provider = $"{adapter.GetValue("ProviderName")} {adapter.GetValue("DriverDesc")}";
                if (provider.IndexOf("NVIDIA", StringComparison.OrdinalIgnoreCase) < 0) continue;

                adapter.SetValue(op.Value, RegistryPath.Convert(op.ValueType, op.Data), RegistryPath.KindOf(op.ValueType));
            }
        }

        private static void DeleteFiles(TweakOperation op)
        {
            string full = Environment.ExpandEnvironmentVariables(op.Path);
            string directory = System.IO.Path.GetDirectoryName(full) ?? "";
            string pattern = System.IO.Path.GetFileName(full);

            if (pattern.Length == 0 || Directory.Exists(full)) { directory = full; pattern = "*"; }
            if (!Directory.Exists(directory)) return;

            var search = op.Recursive ? SearchOption.AllDirectories : SearchOption.TopDirectoryOnly;
            foreach (string file in Directory.EnumerateFiles(directory, pattern, search))
                TryDelete(file);
        }

        private static void DeleteDirectory(string path)
        {
            string full = Environment.ExpandEnvironmentVariables(path);
            if (!Directory.Exists(full)) return;

            foreach (string file in Directory.EnumerateFiles(full, "*", SearchOption.AllDirectories))
                TryDelete(file);
            try { Directory.Delete(full, true); } catch (IOException) { } catch (UnauthorizedAccessException) { }
        }

        private static void TryDelete(string file)
        {
            try
            {
                File.SetAttributes(file, FileAttributes.Normal);
                File.Delete(file);
            }
            catch (IOException) { }
            catch (UnauthorizedAccessException) { }
        }

        private static void Kill(string process)
        {
            foreach (var p in Process.GetProcessesByName(process))
            {
                try { p.Kill(true); p.WaitForExit(3000); } catch (Exception) { }
                finally { p.Dispose(); }
            }
        }

        private static void Exec(TweakOperation op)
        {
            var info = new ProcessStartInfo
            {
                FileName = Environment.ExpandEnvironmentVariables(op.FileName),
                Arguments = Environment.ExpandEnvironmentVariables(op.Arguments),
                WorkingDirectory = Environment.ExpandEnvironmentVariables(op.WorkingDirectory),
                UseShellExecute = false,
                CreateNoWindow = true,
                RedirectStandardOutput = true,
                RedirectStandardError = true
            };

            if (info.WorkingDirectory.Length > 0 && !Directory.Exists(info.WorkingDirectory))
                info.WorkingDirectory = "";

            using var process = Process.Start(info);
            process?.WaitForExit(30000);
        }

        private static bool Equal(object current, TweakOperation detect)
        {
            if (detect.ValueType is "dword" or "qword")
                return System.Convert.ToInt64(current) == System.Convert.ToInt64(RegistryPath.Convert(detect.ValueType, detect.Data));

            if (current is byte[] bytes)
                return System.Convert.ToHexString(bytes).Equals(detect.Data.Replace(" ", ""), StringComparison.OrdinalIgnoreCase);

            return string.Equals(current.ToString(), detect.Data, StringComparison.OrdinalIgnoreCase);
        }
    }
}
