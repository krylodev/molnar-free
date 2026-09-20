using Molnar_Free_Tweaking_Utility.Controls;
using Molnar_Free_Tweaking_Utility.Core;

namespace Molnar_Free_Tweaking_Utility.Views
{
    public partial class OptimizationsView : UserControl
    {
        private readonly List<TweakCard> cards = [];
        private bool building;

        public event EventHandler? TweakChanged;

        public OptimizationsView()
        {
            InitializeComponent();
            BuildFilters();
            BuildCards();
        }

        public void Reload()
        {
            foreach (var card in cards)
                if (card.Tweak is not null) card.SetChecked(card.Tweak.Enabled);
            ApplyFilter();
        }

        public void FocusSearch() => searchBox.Focus();

        private void BuildFilters()
        {
            var items = new List<string> { "All", "Enabled", "Disabled" };
            items.AddRange(Categories.All.Select(c => c.Display));
            filterBox.Items = [.. items];
            filterBox.SelectedIndex = 0;
        }

        private void BuildCards()
        {
            building = true;
            cardsPanel.Visible = false;
            cardsPanel.SuspendLayout();

            foreach (var tweak in TweakCatalog.Tweaks)
            {
                var card = new TweakCard { Tweak = tweak };
                card.ToggleRequested += OnToggleRequested;
                card.DetailsRequested += OnDetailsRequested;
                cards.Add(card);
            }

            cardsPanel.Controls.AddRange([.. cards]);
            cardsPanel.ResumeLayout();
            cardsPanel.Visible = true;
            building = false;
            ApplyFilter();
        }

        private void OnFilterChanged(object? sender, EventArgs e)
        {
            if (!building) ApplyFilter();
        }

        private void ApplyFilter()
        {
            string query = searchBox.Text.Trim();
            string filter = filterBox.SelectedIndex > 0 ? filterBox.SelectedItem : "All";
            string? categoryKey = Categories.All.FirstOrDefault(c => c.Display == filter)?.Key;

            cardsPanel.SuspendLayout();
            int visible = 0;

            foreach (var card in cards)
            {
                var tweak = card.Tweak!;
                bool matches = Matches(tweak, query, filter, categoryKey);
                card.Visible = matches;
                if (matches) visible++;
            }

            cardsPanel.ResumeLayout();
            countLabel.Content = $"{visible} of {TweakCatalog.Tweaks.Count} optimizations";
            emptyLabel.Visible = visible == 0;
            scrollBar.Visible = cardsPanel.VerticalScroll.Visible;
        }

        private static bool Matches(Tweak tweak, string query, string filter, string? categoryKey)
        {
            if (query.Length > 0 &&
                tweak.Name.IndexOf(query, StringComparison.OrdinalIgnoreCase) < 0 &&
                tweak.Description.IndexOf(query, StringComparison.OrdinalIgnoreCase) < 0)
                return false;

            return filter switch
            {
                "Enabled" => tweak.Enabled,
                "Disabled" => !tweak.Enabled,
                "All" => true,
                _ => categoryKey is not null && tweak.Categories.Contains(categoryKey)
            };
        }

        private async void OnToggleRequested(object? sender, Tweak tweak)
        {
            var card = (TweakCard)sender!;
            bool apply = !tweak.Enabled;

            if (apply && !await Confirm(tweak)) { card.SetChecked(false); return; }

            Cursor = Cursors.WaitCursor;
            var result = await Task.Run(() => TweakEngine.Run(tweak, apply));
            Cursor = Cursors.Default;

            tweak.Enabled = apply;
            card.SetChecked(apply);
            TweakChanged?.Invoke(this, EventArgs.Empty);

            if (!result.Ok)
                await Dialogs.Message(ParentForm!, string.Join(Environment.NewLine, result.Errors.Take(6)),
                    $"{result.Failed} of {result.Succeeded + result.Failed} steps failed");

            if (filterBox.SelectedIndex is 1 or 2) ApplyFilter();
        }

        private async Task<bool> Confirm(Tweak tweak)
        {
            if (!tweak.Warning && !tweak.OneWay) return true;

            string message = tweak.OneWay
                ? $"{tweak.Name} cannot be reverted automatically.{Environment.NewLine}{tweak.Note}"
                : $"{tweak.Name} changes system behaviour and may affect stability.";

            return await Dialogs.Confirm(ParentForm!, $"{message}{Environment.NewLine}{Environment.NewLine}Continue?", "Are you sure?");
        }

        private void OnDetailsRequested(object? sender, Tweak tweak)
        {
            using var dialog = new TweakDetailsDialog(tweak);
            dialog.ShowDialog(ParentForm);
        }
    }
}
