using Guna.UI2.WinForms;
using Molnar_Free_Tweaking_Utility.Core;
using Molnar_Free_Tweaking_Utility.Properties;
using Molnar_Free_Tweaking_Utility.Views;

namespace Molnar_Free_Tweaking_Utility
{
    public partial class Main : Form
    {
        private const int SlideOffset = 18;

        private readonly Dictionary<Guna2Button, Func<UserControl>> factories = [];
        private readonly Dictionary<Guna2Button, UserControl> pages = [];
        private Guna2Button? activeButton;
        private UserControl? activePage;

        public Main()
        {
            InitializeComponent();
            WireNavigation();
            Render.EnableDoubleBuffer(this);
            Navigate(navDashboard);
            Shown += (_, _) => BeginInvoke(() => WarmPages(0));
        }

        public void OpenPage(string name)
        {
            var button = name.ToLowerInvariant() switch
            {
                "optimizations" => navOptimizations,
                "backup" => navBackup,
                "settings" => navSettings,
                "about" => navAbout,
                _ => navDashboard
            };
            Navigate(button);
        }

        private void WireNavigation()
        {
            factories[navDashboard] = CreateDashboard;
            factories[navOptimizations] = CreateOptimizations;
            factories[navBackup] = CreateBackup;
            factories[navSettings] = CreateSettings;
            factories[navAbout] = () => new AboutView();

            SetNavIcon(navDashboard, Resources.Home, "Dashboard");
            SetNavIcon(navOptimizations, Resources.Bolt, "Optimizations");
            SetNavIcon(navBackup, Resources.Backup, "Backup");
            SetNavIcon(navSettings, Resources.Settings, "Settings");
            SetNavIcon(navAbout, Resources.Help, "About");
        }

        private void SetNavIcon(Guna2Button button, Image icon, string tooltip)
        {
            button.Image = Icons.Tint(icon, Theme.TextMuted);
            button.HoverState.Image = Icons.Tint(icon, Theme.Text);
            button.CheckedState.Image = Icons.Tint(icon, Theme.Text);
            navTooltip.SetToolTip(button, tooltip);
            button.Text = "";
        }

        private UserControl CreateDashboard()
        {
            var view = new DashboardView();
            view.BackupRequested += (_, _) => Navigate(navBackup);
            view.OptimizeRequested += (_, _) => Navigate(navOptimizations);
            return view;
        }

        private UserControl CreateOptimizations()
        {
            var view = new OptimizationsView();
            view.TweakChanged += (_, _) => RefreshDashboard();
            return view;
        }

        private UserControl CreateBackup()
        {
            var view = new BackupView();
            view.BackupRestored += (_, _) => RefreshState();
            return view;
        }

        private UserControl CreateSettings()
        {
            var view = new SettingsView();
            view.StateChanged += (_, _) => RefreshState();
            return view;
        }

        private void RefreshDashboard()
        {
            if (pages.TryGetValue(navDashboard, out var view)) ((DashboardView)view).UpdateCounters();
        }

        private void RefreshState()
        {
            if (pages.TryGetValue(navOptimizations, out var view)) ((OptimizationsView)view).Reload();
            RefreshDashboard();
        }

        private void OnNavigate(object? sender, EventArgs e)
        {
            if (sender is Guna2Button button) Navigate(button);
        }

        private async void Navigate(Guna2Button button)
        {
            if (ReferenceEquals(activeButton, button)) return;

            foreach (var nav in factories.Keys) nav.Checked = nav == button;
            activeButton = button;
            MoveIndicator(button);

            var previous = activePage;
            var page = EnsurePage(button);
            activePage = page;

            page.Location = new Point(0, SlideOffset);
            page.Visible = true;
            page.BringToFront();
            if (previous is not null && previous != page) previous.Visible = false;

            pageAnimator.TargetControl = page;
            pageAnimator.TargetLocation = Point.Empty;
            await pageAnimator.PlayAnimation();

            page.Location = Point.Empty;
        }

        private UserControl EnsurePage(Guna2Button button)
        {
            if (pages.TryGetValue(button, out var page)) return page;

            UseWaitCursor = true;
            page = factories[button]();
            page.Anchor = AnchorStyles.None;
            page.Size = pageHost.ClientSize;
            page.Location = new Point(0, SlideOffset);
            page.Visible = false;
            pageHost.Controls.Add(page);
            pages[button] = page;
            UseWaitCursor = false;
            return page;
        }

        private void WarmPages(int index)
        {
            var buttons = factories.Keys.ToList();
            if (index >= buttons.Count) return;

            EnsurePage(buttons[index]);
            BeginInvoke(() => WarmPages(index + 1));
        }

        private async void MoveIndicator(Guna2Button button)
        {
            navIndicator.BringToFront();
            indicatorAnimator.TargetLocation = new Point(button.Left + (button.Width - navIndicator.Width) / 2, 82);
            await indicatorAnimator.PlayAnimation();
        }
    }
}
