using System.Text.Json.Serialization;

namespace Molnar_Free_Tweaking_Utility.Core
{
    public sealed class TweakOperation
    {
        [JsonPropertyName("k")] public string Kind { get; set; } = "";
        [JsonPropertyName("p")] public string Path { get; set; } = "";
        [JsonPropertyName("v")] public string Value { get; set; } = "";
        [JsonPropertyName("t")] public string ValueType { get; set; } = "";
        [JsonPropertyName("d")] public string Data { get; set; } = "";
        [JsonPropertyName("f")] public string FileName { get; set; } = "";
        [JsonPropertyName("a")] public string Arguments { get; set; } = "";
        [JsonPropertyName("w")] public string WorkingDirectory { get; set; } = "";
        [JsonPropertyName("r")] public bool Recursive { get; set; }
    }

    public sealed class Tweak
    {
        [JsonPropertyName("id")] public string Id { get; set; } = "";
        [JsonPropertyName("name")] public string Name { get; set; } = "";
        [JsonPropertyName("desc")] public string Description { get; set; } = "";
        [JsonPropertyName("cats")] public List<string> Categories { get; set; } = [];
        [JsonPropertyName("warning")] public bool Warning { get; set; }
        [JsonPropertyName("oneway")] public bool OneWay { get; set; }
        [JsonPropertyName("note")] public string Note { get; set; } = "";
        [JsonPropertyName("detect")] public TweakOperation? Detect { get; set; }
        [JsonPropertyName("apply")] public List<TweakOperation> Apply { get; set; } = [];
        [JsonPropertyName("revert")] public List<TweakOperation> Revert { get; set; } = [];

        [JsonIgnore] public bool Enabled { get; set; }

        public IEnumerable<CategoryInfo> CategoryInfos =>
            Categories.Select(Core.Categories.Find).Where(c => c is not null)!;
    }

    public sealed class TweakResult
    {
        public int Succeeded { get; set; }
        public int Failed { get; set; }
        public List<string> Errors { get; } = [];
        public bool Ok => Failed == 0;
    }
}
