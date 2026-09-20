using System.Drawing.Imaging;

namespace Molnar_Free_Tweaking_Utility.Core
{
    public static class Icons
    {
        private static readonly Dictionary<(Image, Color), Image> Cache = [];

        public static Image Tint(Image source, Color color)
        {
            if (Cache.TryGetValue((source, color), out var cached)) return cached;

            var tinted = new Bitmap(source.Width, source.Height, PixelFormat.Format32bppArgb);
            var matrix = new ColorMatrix
            {
                Matrix00 = 0, Matrix11 = 0, Matrix22 = 0,
                Matrix40 = color.R / 255f,
                Matrix41 = color.G / 255f,
                Matrix42 = color.B / 255f
            };

            using (var graphics = Graphics.FromImage(tinted))
            using (var attributes = new ImageAttributes())
            {
                graphics.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
                attributes.SetColorMatrix(matrix);
                graphics.DrawImage(source, new Rectangle(0, 0, tinted.Width, tinted.Height),
                    0, 0, source.Width, source.Height, GraphicsUnit.Pixel, attributes);
            }

            Cache[(source, color)] = tinted;
            return tinted;
        }
    }
}
