using QRCoder;
using QRCodeGenerator.API.Models;
using System.Collections.Concurrent;

namespace QRCodeGenerator.API.Services;

public class QRCodeService : IQRCodeService
{
    private readonly ILogger<QRCodeService> _logger;
    private readonly ConcurrentDictionary<int, Models.QRCode> _store = new();
    private int _nextId = 1;

    public QRCodeService(ILogger<QRCodeService> logger)
    {
        _logger = logger;
    }

    public async Task<GenerateQRResponse> GenerateQRAsync(GenerateQRRequest request)
    {
        try
        {
            var qrGenerator = new QRCoder.QRCodeGenerator();
            var eccLevel = GetErrorCorrectionLevel(request.ErrorCorrectionLevel);
            var qrCodeData = qrGenerator.CreateQrCode(request.Data, eccLevel);

            var pngQrCode = new PngByteQRCode(qrCodeData);
            var darkColor = HexToRgb(request.FgColor);
            var lightColor = HexToRgb(request.BgColor);
            var pngBytes = pngQrCode.GetGraphic(20, darkColor, lightColor);

            var base64Image = "data:image/png;base64," + Convert.ToBase64String(pngBytes);

            var entity = new Models.QRCode
            {
                Id = Interlocked.Increment(ref _nextId),
                Data = request.Data,
                Size = request.Size,
                BgColor = request.BgColor,
                FgColor = request.FgColor,
                ErrorCorrectionLevel = request.ErrorCorrectionLevel,
                Base64Image = base64Image,
                CreatedAt = DateTime.UtcNow
            };

            _store[entity.Id] = entity;

            return await Task.FromResult(new GenerateQRResponse
            {
                Id = entity.Id,
                Data = entity.Data,
                Base64Image = base64Image,
                CreatedAt = entity.CreatedAt
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating QR code");
            throw;
        }
    }

    public Task<Models.QRCode?> GetQRCodeByIdAsync(int id)
    {
        _store.TryGetValue(id, out var qrCode);
        return Task.FromResult(qrCode);
    }

    public Task<List<Models.QRCode>> GetAllQRCodesAsync()
    {
        return Task.FromResult(_store.Values.OrderByDescending(q => q.CreatedAt).ToList());
    }

    private static QRCoder.QRCodeGenerator.ECCLevel GetErrorCorrectionLevel(string level) =>
        level.ToUpper() switch
        {
            "L" => QRCoder.QRCodeGenerator.ECCLevel.L,
            "M" => QRCoder.QRCodeGenerator.ECCLevel.M,
            "Q" => QRCoder.QRCodeGenerator.ECCLevel.Q,
            "H" => QRCoder.QRCodeGenerator.ECCLevel.H,
            _ => QRCoder.QRCodeGenerator.ECCLevel.M
        };

    private static byte[] HexToRgb(string hex)
    {
        hex = hex.TrimStart('#');
        return [Convert.ToByte(hex[..2], 16), Convert.ToByte(hex[2..4], 16), Convert.ToByte(hex[4..6], 16)];
    }
}
