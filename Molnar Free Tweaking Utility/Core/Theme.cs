namespace Molnar_Free_Tweaking_Utility.Core
{
    public static class Theme
    {
        public static readonly Color Background = Color.FromArgb(8, 8, 10);
        public static readonly Color Surface = Color.FromArgb(13, 13, 16);
        public static readonly Color SurfaceAlt = Color.FromArgb(17, 17, 22);
        public static readonly Color SurfaceHover = Color.FromArgb(22, 22, 28);
        public static readonly Color Border = Color.FromArgb(28, 28, 36);
        public static readonly Color Text = Color.FromArgb(247, 243, 244);
        public static readonly Color TextMuted = Color.FromArgb(97, 96, 104);
        public static readonly Color Accent = Color.FromArgb(93, 110, 234);
        public static readonly Color AccentAlt = Color.FromArgb(150, 148, 244);
        public static readonly Color Danger = Color.FromArgb(253, 6, 87);
        public static readonly Color Success = Color.FromArgb(96, 255, 114);

        public static readonly Font Title = new("Poppins SemiBold", 15F, FontStyle.Bold);
        public static readonly Font Heading = new("Poppins SemiBold", 11F, FontStyle.Bold);
        public static readonly Font Body = new("Poppins", 8.5F);
        public static readonly Font Caption = new("Poppins", 7.5F);
    }
}
