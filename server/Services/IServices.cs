using QRCodeGenerator.API.Models;

namespace QRCodeGenerator.API.Services;

public interface IQRCodeService
{
    Task<GenerateQRResponse> GenerateQRAsync(GenerateQRRequest request);
    Task<QRCode?> GetQRCodeByIdAsync(int id);
    Task<List<QRCode>> GetAllQRCodesAsync();
}

public interface IDesignService
{
    Task<UploadDesignResponse> UploadDesignAsync(IFormFile file);
    Task<Design?> GetDesignByIdAsync(int id);
    Task<List<Design>> GetAllDesignsAsync();
    Task<bool> DeleteDesignAsync(int id);
    Task<PlaceQROnDesignResponse> PlaceQROnDesignAsync(PlaceQROnDesignRequest request);
}
