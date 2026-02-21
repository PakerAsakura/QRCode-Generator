namespace QRCodeGenerator.API.Models;

public class GenerateQRRequest
{
    public string Data { get; set; } = string.Empty;
    public int Size { get; set; } = 256;
    public string BgColor { get; set; } = "#ffffff";
    public string FgColor { get; set; } = "#000000";
    public string ErrorCorrectionLevel { get; set; } = "M";
}

public class GenerateQRResponse
{
    public int Id { get; set; }
    public string Data { get; set; } = string.Empty;
    public string Base64Image { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class UploadDesignResponse
{
    public int Id { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    public long FileSize { get; set; }
}

public class PlaceQROnDesignRequest
{
    public int DesignId { get; set; }
    public int QRCodeId { get; set; }
    public int PositionX { get; set; }
    public int PositionY { get; set; }
    public int Size { get; set; } = 150;
}

public class PlaceQROnDesignResponse
{
    public int Id { get; set; }
    public string ResultImageBase64 { get; set; } = string.Empty;
    public string ResultImagePath { get; set; } = string.Empty;
}
