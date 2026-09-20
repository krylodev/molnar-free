using CuoreUI.Components;

namespace Molnar_Free_Tweaking_Utility.Core
{
    public static class Dialogs
    {
        public static Task<DialogResult> Message(Form owner, string message, string title) =>
            Create().ShowDialog(owner, message, title);

        public static async Task<bool> Confirm(Form owner, string message, string title) =>
            await Create().ShowDialog(owner, message, title, MessageBoxButtons.YesNo) == DialogResult.Yes;

        private static cuiMessageDialog Create() => new()
        {
            BackColor = Theme.Surface,
            ForeColor = Theme.Text,
            DimColor = Color.FromArgb(160, 0, 0, 0),
            DialogSize = new Size(420, 200),
            ButtonSize = new Size(110, 34),
            DialogPadding = new Padding(20),
            Rounding = 12
        };
    }
}
