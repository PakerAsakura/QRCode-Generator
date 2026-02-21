namespace QRCodeGenerator.API.Models;

public class Design
{
    public int Id { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    public string FileType { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public class QRCode
{
    public int Id { get; set; }
    public string Data { get; set; } = string.Empty;
    public string? ImagePath { get; set; }
    public string? Base64Image { get; set; }
    public int Size { get; set; } = 256;
    public string BgColor { get; set; } = "#ffffff";
    public string FgColor { get; set; } = "#000000";
    public string ErrorCorrectionLevel { get; set; } = "M";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class QRCodeWithDesign
{
    public int Id { get; set; }
    public int DesignId { get; set; }
    public int QRCodeId { get; set; }
    public int PositionX { get; set; }
    public int PositionY { get; set; }
    public int Size { get; set; }
    public string? ResultImagePath { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
}
