using System.Runtime.InteropServices;
using Microsoft.Win32;

namespace Molnar_Free_Tweaking_Utility.Core
{
    public static partial class SystemInfo
    {
        public static string Processor { get; } = ReadProcessor();
        public static string GraphicsCard { get; } = ReadGraphicsCard();
        public static string Memory { get; } = ReadMemory();
        public static string OperatingSystem { get; } = ReadOperatingSystem();
        public static string UserName { get; } = Environment.UserName;

        private static string ReadProcessor()
        {
            string name = Read(@"HKLM\HARDWARE\DESCRIPTION\System\CentralProcessor\0", "ProcessorNameString");
            return name.Length > 0 ? name.Trim() : "Unknown Processor";
        }

        private static string ReadGraphicsCard()
        {
            using var root = RegistryKey.OpenBaseKey(RegistryHive.LocalMachine, RegistryView.Registry64);
            using var container = root.OpenSubKey(@"SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}");
            if (container is null) return "Unknown Graphics Card";

            foreach (string name in container.GetSubKeyNames().Where(n => n.All(char.IsDigit)))
            {
                using var adapter = container.OpenSubKey(name);
                if (adapter?.GetValue("DriverDesc") is string description && description.Length > 0)
                    return description;
            }
            return "Unknown Graphics Card";
        }

        private static string ReadMemory()
        {
            var status = new MemoryStatus { Length = (uint)Marshal.SizeOf<MemoryStatus>() };
            if (!GlobalMemoryStatusEx(ref status)) return "Unknown";
            return $"{status.TotalPhysical / 1024 / 1024 / 1024} GB";
        }

        private static string ReadOperatingSystem()
        {
            const string key = @"HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion";
            string product = Read(key, "ProductName");
            string display = Read(key, "DisplayVersion");
            string build = Read(key, "CurrentBuild");

            if (int.TryParse(build, out int number) && number >= 22000)
                product = product.Replace("Windows 10", "Windows 11");

            return $"{product} {display}".Trim();
        }

        private static string Read(string path, string name) => RegistryPath.Read(path, name)?.ToString() ?? "";

        [StructLayout(LayoutKind.Sequential)]
        private struct MemoryStatus
        {
            public uint Length;
            public uint MemoryLoad;
            public ulong TotalPhysical;
            public ulong AvailablePhysical;
            public ulong TotalPageFile;
            public ulong AvailablePageFile;
            public ulong TotalVirtual;
            public ulong AvailableVirtual;
            public ulong AvailableExtendedVirtual;
        }

        [DllImport("kernel32.dll", SetLastError = true)]
        [return: MarshalAs(UnmanagedType.Bool)]
        private static extern bool GlobalMemoryStatusEx(ref MemoryStatus status);
    }
}
