using System.Reflection;

namespace Molnar_Free_Tweaking_Utility.Core
{
    public static class Render
    {
        private static readonly PropertyInfo? Buffered =
            typeof(Control).GetProperty("DoubleBuffered", BindingFlags.Instance | BindingFlags.NonPublic);

        public static void EnableDoubleBuffer(Control control)
        {
            if (SystemInformation.TerminalServerSession) return;

            Buffered?.SetValue(control, true);
            foreach (Control child in control.Controls) EnableDoubleBuffer(child);
            control.ControlAdded += (_, e) => { if (e.Control is not null) EnableDoubleBuffer(e.Control); };
        }
    }
}
