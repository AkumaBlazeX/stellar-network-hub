# 🏗️ AWS Architecture Diagram Generator

A Python script to generate professional AWS architecture flowcharts showing services and their connections.

## 🚀 Features

- **Professional Diagrams**: Clean, color-coded AWS service diagrams
- **Service Connections**: Shows data flow between AWS services
- **Multiple Layouts**: Both detailed and simple architecture diagrams
- **High Quality**: PNG output with 300 DPI resolution
- **Customizable**: Easy to modify colors, layouts, and services

## 📋 Prerequisites

### 1. Install Python Dependencies
```bash
pip install -r requirements.txt
```

### 2. Install System Graphviz
**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install graphviz
```

**macOS:**
```bash
brew install graphviz
```

**Windows:**
Download from [https://graphviz.org/download/](https://graphviz.org/download/)

## 🎯 Usage

### Generate ProfessionalNet Architecture
```bash
python aws_architecture_generator.py
```

This will create:
- `professionalnet_aws_architecture.png` - Complete ProfessionalNet architecture
- `simple_aws_architecture.png` - Simplified AWS architecture

## 📊 Generated Diagrams

### ProfessionalNet Architecture
Shows the complete AWS serverless architecture including:

**User Layer:**
- 👤 User (Browser)

**Frontend Layer:**
- 📱 React Frontend

**Network Layer:**
- 🌐 CloudFront CDN
- 🔗 API Gateway
- 🔐 Cognito
- 🌐 VPC

**Backend Layer:**
- ⚡ Lambda Functions (Posts, Users, Connections, Upload)

**Data Layer:**
- 📁 S3 Storage
- 🗄️ DynamoDB Tables
- 📊 CloudWatch
- 🔒 IAM

### Simple Architecture
Shows a basic AWS serverless flow:
- User → Frontend → API Gateway → Lambda → Database/Storage

## 🎨 Customization

### Modify Colors
Edit the `service_colors` dictionary in the script:

```python
self.service_colors = {
    'user': '#FFD700',      # Gold
    'frontend': '#87CEEB',  # Light Blue
    'api': '#FF6347',       # Tomato Red
    # ... add more colors
}
```

### Add New Services
To add a new AWS service:

1. Add the service node in the appropriate layer method
2. Create connections to other services
3. Update the color scheme if needed

### Modify Layout
Change the graph attributes:

```python
self.dot.attr(
    rankdir='TB',    # Top to Bottom
    # rankdir='LR',  # Left to Right
    size='12,16',    # Size in inches
    dpi='300'        # Resolution
)
```

## 🔧 Code Structure

### Main Classes
- `AWSArchitectureGenerator`: Main class for creating detailed diagrams
- `create_simple_architecture()`: Function for simple diagrams

### Key Methods
- `_create_user_layer()`: User interface layer
- `_create_frontend_layer()`: Frontend services
- `_create_network_layer()`: Network and API services
- `_create_backend_layer()`: Lambda functions
- `_create_data_layer()`: Database and storage
- `_create_connections()`: Service connections

## 📁 Output Files

The script generates:
- `.png` files: High-quality diagram images
- `.gv` files: Graphviz source files (can be edited manually)

## 🎯 Example Output

The generated diagrams will show:

1. **Service Boxes**: Color-coded AWS services
2. **Connection Lines**: Data flow between services
3. **Labels**: Service names and endpoints
4. **Layers**: Organized by architectural layers

## 🚀 Advanced Usage

### Create Custom Architecture
```python
from aws_architecture_generator import AWSArchitectureGenerator

# Create custom architecture
generator = AWSArchitectureGenerator()
generator.create_professionalnet_architecture("my_custom_architecture")
```

### Modify Service Details
Edit the node creation methods to change:
- Service names
- Endpoints
- Descriptions
- Colors
- Layout

## 💡 Tips

1. **High Resolution**: Use 300 DPI for print quality
2. **Color Coding**: Use consistent colors for service types
3. **Clear Labels**: Keep service descriptions concise
4. **Logical Flow**: Arrange services in data flow order
5. **Grouping**: Use clusters to organize related services

## 🔍 Troubleshooting

### Common Issues

**"graphviz not found"**
- Install system graphviz package
- Ensure it's in your system PATH

**"Permission denied"**
- Check write permissions in output directory
- Run with appropriate permissions

**"Invalid syntax"**
- Check Python version (requires 3.6+)
- Verify all dependencies are installed

## 📈 Future Enhancements

Possible improvements:
- Interactive diagrams (SVG output)
- Animation support
- Multiple layout options
- Service cost integration
- Real-time AWS service discovery
- Custom templates

---

**🏗️ Generate professional AWS architecture diagrams with ease!** 