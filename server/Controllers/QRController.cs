using Microsoft.AspNetCore.Mvc;
using QRCodeGenerator.API.Models;
using QRCodeGenerator.API.Services;

namespace QRCodeGenerator.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class QRController : ControllerBase
{
    private readonly IQRCodeService _qrCodeService;
    private readonly ILogger<QRController> _logger;

    public QRController(IQRCodeService qrCodeService, ILogger<QRController> logger)
    {
        _qrCodeService = qrCodeService;
        _logger = logger;
    }

    [HttpPost("generate")]
    public async Task<ActionResult<GenerateQRResponse>> GenerateQR([FromBody] GenerateQRRequest request)
    {
        try
        {
            if (string.IsNullOrEmpty(request.Data))
                return BadRequest("Data is required");

            var result = await _qrCodeService.GenerateQRAsync(request);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating QR code");
            return StatusCode(500, "Error generating QR code");
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<QRCode>> GetQRCode(int id)
    {
        try
        {
            var qrCode = await _qrCodeService.GetQRCodeByIdAsync(id);
            if (qrCode == null)
                return NotFound();

            return Ok(qrCode);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving QR code");
            return StatusCode(500, "Error retrieving QR code");
        }
    }

    [HttpGet]
    public async Task<ActionResult<List<QRCode>>> GetAllQRCodes()
    {
        try
        {
            var qrCodes = await _qrCodeService.GetAllQRCodesAsync();
            return Ok(qrCodes);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving QR codes");
            return StatusCode(500, "Error retrieving QR codes");
        }
    }
}
