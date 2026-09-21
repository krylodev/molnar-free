using Molnar_Free_Tweaking_Utility.Views;

namespace Molnar_Free_Tweaking_Utility.Core
{
    public static class Dialogs
    {
        public static Task<DialogResult> Message(Form owner, string message, string title) =>
            Task.FromResult(Show(owner, title, message, false));

        public static Task<bool> Confirm(Form owner, string message, string title) =>
            Task.FromResult(Show(owner, title, message, true) == DialogResult.Yes);

        private static DialogResult Show(Form owner, string title, string message, bool confirm)
        {
            using var dim = new Form
            {
                BackColor = Color.Black,
                FormBorderStyle = FormBorderStyle.None,
                Opacity = 0.55,
                ShowInTaskbar = false,
                StartPosition = FormStartPosition.Manual,
                Bounds = owner.Bounds,
                Region = owner.Region?.Clone()
            };
            using var dialog = new MessageDialog(title, message, confirm);

            dim.Show(owner);
            return dialog.ShowDialog(dim);
        }
    }
}
