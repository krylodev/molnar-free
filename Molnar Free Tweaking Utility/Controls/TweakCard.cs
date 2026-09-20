using System.ComponentModel;
using Molnar_Free_Tweaking_Utility.Core;

namespace Molnar_Free_Tweaking_Utility.Controls
{
    public partial class TweakCard : UserControl
    {
        private Tweak? tweak;
        private bool suppressEvents;

        public event EventHandler<Tweak>? ToggleRequested;
        public event EventHandler<Tweak>? DetailsRequested;

        public TweakCard()
        {
            InitializeComponent();
        }

        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public Tweak? Tweak
        {
            get => tweak;
            set
            {
                tweak = value;
                if (value is null) return;

                titleLabel.Content = value.Name;
                descriptionLabel.Text = Shorten(value.Description, 84);

                chips.Controls.Clear();
                foreach (var category in value.CategoryInfos.Take(5))
                    chips.Controls.Add(new CategoryChip { Category = category });

                SetChecked(value.Enabled);
            }
        }

        private static string Shorten(string text, int limit)
        {
            if (text.Length <= limit) return text;
            int cut = text.LastIndexOf(' ', limit - 1);
            return string.Concat(text.AsSpan(0, cut > limit / 2 ? cut : limit - 1).TrimEnd(), "…");
        }

        public void SetChecked(bool value)
        {
            suppressEvents = true;
            toggle.Checked = value;
            suppressEvents = false;
        }

        private void OnToggleChanged(object? sender, EventArgs e)
        {
            if (suppressEvents || tweak is null) return;
            ToggleRequested?.Invoke(this, tweak);
        }

        private void OnReadMoreClick(object? sender, EventArgs e)
        {
            if (tweak is not null) DetailsRequested?.Invoke(this, tweak);
        }
    }
}
