using Microsoft.AspNetCore.Mvc;
using QRCodeGenerator.API.Models;
using QRCodeGenerator.API.Services;

namespace QRCodeGenerator.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DesignController : ControllerBase
{
    private readonly IDesignService _designService;
    private readonly ILogger<DesignController> _logger;

    public DesignController(IDesignService designService, ILogger<DesignController> logger)
    {
        _designService = designService;
        _logger = logger;
    }

    [HttpPost("upload")]
    public async Task<ActionResult<UploadDesignResponse>> UploadDesign(IFormFile file)
    {
        try
        {
            if (file == null || file.Length == 0)
                return BadRequest("File is required");

            var result = await _designService.UploadDesignAsync(file);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading design");
            return StatusCode(500, "Error uploading design");
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Design>> GetDesign(int id)
    {
        try
        {
            var design = await _designService.GetDesignByIdAsync(id);
            if (design == null)
                return NotFound();

            return Ok(design);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving design");
            return StatusCode(500, "Error retrieving design");
        }
    }

    [HttpGet]
    public async Task<ActionResult<List<Design>>> GetAllDesigns()
    {
        try
        {
            var designs = await _designService.GetAllDesignsAsync();
            return Ok(designs);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving designs");
            return StatusCode(500, "Error retrieving designs");
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteDesign(int id)
    {
        try
        {
            var result = await _designService.DeleteDesignAsync(id);
            if (!result)
                return NotFound();

            return Ok("Design deleted successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting design");
            return StatusCode(500, "Error deleting design");
        }
    }

    [HttpPost("place-qr")]
    public async Task<ActionResult<PlaceQROnDesignResponse>> PlaceQROnDesign([FromBody] PlaceQROnDesignRequest request)
    {
        try
        {
            var result = await _designService.PlaceQROnDesignAsync(request);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error placing QR code on design");
            return StatusCode(500, "Error placing QR code on design");
        }
    }
}
