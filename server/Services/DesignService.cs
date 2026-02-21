using QRCodeGenerator.API.Models;
using System.Collections.Concurrent;

namespace QRCodeGenerator.API.Services;

public class DesignService : IDesignService
{
    private readonly ILogger<DesignService> _logger;
    private readonly ConcurrentDictionary<int, Design> _store = new();
    private int _nextId = 1;
    private readonly string _uploadPath;

    public DesignService(ILogger<DesignService> logger)
    {
        _logger = logger;
        _uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
        Directory.CreateDirectory(_uploadPath);
    }

    public async Task<UploadDesignResponse> UploadDesignAsync(IFormFile file)
    {
        try
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("File is empty");

            var fileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
            var filePath = Path.Combine(_uploadPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var design = new Design
            {
                Id = Interlocked.Increment(ref _nextId),
                FileName = file.FileName,
                FilePath = filePath,
                FileType = file.ContentType ?? "application/octet-stream",
                FileSize = file.Length,
                CreatedAt = DateTime.UtcNow
            };

            _store[design.Id] = design;

            return new UploadDesignResponse
            {
                Id = design.Id,
                FileName = design.FileName,
                FilePath = design.FilePath,
                FileSize = design.FileSize
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading design");
            throw;
        }
    }

    public Task<Design?> GetDesignByIdAsync(int id)
    {
        _store.TryGetValue(id, out var design);
        return Task.FromResult(design);
    }

    public Task<List<Design>> GetAllDesignsAsync()
    {
        return Task.FromResult(_store.Values.OrderByDescending(d => d.CreatedAt).ToList());
    }

    public Task<bool> DeleteDesignAsync(int id)
    {
        if (!_store.TryRemove(id, out var design))
            return Task.FromResult(false);

        if (File.Exists(design.FilePath))
            File.Delete(design.FilePath);

        return Task.FromResult(true);
    }

    public Task<PlaceQROnDesignResponse> PlaceQROnDesignAsync(PlaceQROnDesignRequest request)
    {
        return Task.FromResult(new PlaceQROnDesignResponse
        {
            Id = 0,
            ResultImageBase64 = string.Empty,
            ResultImagePath = string.Empty
        });
    }
}
