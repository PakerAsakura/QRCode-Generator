# QR Code Generator

A modern full-stack web application for generating QR codes with custom design placement capabilities.

## Features

**Core Features:**

- Generate QR codes from URLs and text
- Customizable QR code colors, size, and error correction levels
- Upload custom designs/images
- Drag and drop QR code placement on designs
- Real-time preview
- Download generated QR codes with designs
- Modern, responsive UI
- Database persistence with PostgreSQL

## Tech Stack

### Frontend

- **Framework**: Next.js 14+
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **QR Code**: qrcode.react
- **UI/UX**: React Hot Toast for notifications

### Backend

- **Runtime**: C# .NET 8
- **Framework**: ASP.NET Core
- **Database**: PostgreSQL with Entity Framework Core
- **QR Generation**: QRCoder
- **API Documentation**: Swagger/OpenAPI
- **CORS**: Configured for cross-origin requests

## Project Structure

```
qrcodegenerator/
├── client/                    # Next.js frontend
│   ├── app/                  # Next.js app directory
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Home page
│   │   └── globals.css       # Global styles
│   ├── components/           # React components
│   │   ├── QRGenerator.tsx   # Simple QR code generator
│   │   └── DesignUploader.tsx # Design upload & placement
│   ├── lib/                  # Utilities & stores
│   │   ├── api.ts           # API client
│   │   ├── store.ts         # Zustand stores
│   │   └── utils.ts         # Helper functions
│   ├── package.json         # Dependencies
│   ├── tsconfig.json        # TypeScript config
│   ├── tailwind.config.js   # Tailwind config
│   └── .env.local           # Environment variables
│
└── server/                    # C# .NET backend
    ├── Controllers/           # API controllers
    │   ├── QRController.cs   # QR code endpoints
    │   └── DesignController.cs # Design endpoints
    ├── Services/            # Business logic
    │   ├── IServices.cs     # Service interfaces
    │   ├── QRCodeService.cs # QR code generation
    │   └── DesignService.cs # Design management
    ├── Models/              # Data models
    │   ├── Entities.cs      # EF Core entities
    │   └── DTOs.cs          # Data transfer objects
    ├── Data/                # Database
    │   └── AppDbContext.cs  # EF Core context
    ├── Migrations/          # Database migrations
    ├── Program.cs           # Application startup
    ├── appsettings.json     # Configuration
    └── QRCodeGenerator.API.csproj # Project file
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- .NET 8 SDK
- PostgreSQL database
- Git

### Installation

#### Backend Setup (C# .NET)

1. Navigate to the server directory:

```bash
cd server
```

2. Install dependencies (via NuGet):

```bash
dotnet restore
```

3. Configure database connection in `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "User ID=postgres;Password=your_password;Host=localhost;Port=5432;Database=qrcodegenerator;"
  }
}
```

4. Apply migrations:

```bash
dotnet ef database update
```

5. Run the backend server:

```bash
dotnet run
```

The API will be available at `http://localhost:5000`

#### Frontend Setup (Next.js)

1. Navigate to the client directory:

```bash
cd client
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Configure environment variables in `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## API Endpoints

### QR Code Endpoints

**Generate QR Code**

```
POST /api/qr/generate
Content-Type: application/json

{
  "data": "https://example.com",
  "size": 256,
  "bgColor": "#ffffff",
  "fgColor": "#000000",
  "errorCorrectionLevel": "M"
}
```

**Get QR Code**

```
GET /api/qr/{id}
```

**Get All QR Codes**

```
GET /api/qr
```

### Design Endpoints

**Upload Design**

```
POST /api/design/upload
Content-Type: multipart/form-data

FormData with 'file' field containing image
```

**Get Design**

```
GET /api/design/{id}
```

**Get All Designs**

```
GET /api/design
```

**Delete Design**

```
DELETE /api/design/{id}
```

**Place QR on Design**

```
POST /api/design/place-qr
Content-Type: application/json

{
  "designId": 1,
  "qrCodeId": 1,
  "positionX": 100,
  "positionY": 100,
  "size": 150
}
```

## Usage

### Generate Simple QR Code

1. Go to the "Simple" tab
2. Enter a URL or text
3. Customize colors and size using the controls
4. Click "Generate QR Code"
5. Click "Download" to save the QR code

### Generate QR Code with Custom Design

1. Go to the "With Design" tab
2. Upload an image by dragging/dropping or clicking the upload area
3. Enter a link for the QR code
4. Drag the QR code to position it on your design
5. Resize using the handle in the bottom-right corner
6. Adjust position using the sliders in the settings
7. Click "Download with QR Code" to save the composite image

## Database Schema

### Designs Table

- `Id` (int, PK)
- `FileName` (varchar)
- `FilePath` (text)
- `FileType` (varchar)
- `FileSize` (bigint)
- `CreatedAt` (timestamp)
- `UpdatedAt` (timestamp)

### QRCodes Table

- `Id` (int, PK)
- `Data` (text)
- `ImagePath` (text, nullable)
- `Base64Image` (text, nullable)
- `Size` (int)
- `BgColor` (varchar)
- `FgColor` (varchar)
- `ErrorCorrectionLevel` (varchar)
- `CreatedAt` (timestamp)

### QRCodesWithDesigns Table

- `Id` (int, PK)
- `DesignId` (int, FK)
- `QRCodeId` (int, FK)
- `PositionX` (int)
- `PositionY` (int)
- `Size` (int)
- `ResultImagePath` (text, nullable)
- `CreatedAt` (timestamp)

## Configuration

### Environment Variables

**Frontend (.env.local)**

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Backend (appsettings.json)**

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "User ID=postgres;Password=password;Host=localhost;Port=5432;Database=qrcodegenerator;"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information"
    }
  }
}
```

## Development

### Frontend Development

Watch for changes and hot reload:

```bash
cd client
npm run dev
```

Build for production:

```bash
npm run build
npm run start
```

### Backend Development

Watch for changes:

```bash
cd server
dotnet watch run
```

Build for production:

```bash
dotnet publish -c Release
```

## Deployment

### Frontend (Vercel)

```bash
cd client
npm run build

```

### Backend (Azure, AWS, or on-premises)

```bash
cd server
dotnet publish -c Release -o ./publish

```

Update the `NEXT_PUBLIC_API_URL` environment variable to point to your backend URL.

## Contributing

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with Next.js and C# .NET**
