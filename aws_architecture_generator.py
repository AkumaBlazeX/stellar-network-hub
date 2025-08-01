#!/usr/bin/env python3
"""
AWS Architecture Flowchart Generator
Creates professional AWS service diagrams showing connections and data flow
"""

import graphviz
import os

def create_minimalistic_aws_architecture():
    """Create a minimalistic AWS architecture diagram"""
    dot = graphviz.Digraph(
        'minimalistic_aws_architecture',
        format='png',
        engine='dot',
        graph_attr={
            'rankdir': 'TB',
            'splines': 'ortho',
            'nodesep': '0.8',
            'ranksep': '1.2',
            'bgcolor': 'white',
            'fontname': 'Arial',
            'fontsize': '12'
        },
        node_attr={
            'shape': 'box',
            'style': 'filled,rounded',
            'fontname': 'Arial',
            'fontsize': '11',
            'fontcolor': 'white',
            'height': '0.6',
            'width': '2.5',
            'margin': '0.3'
        },
        edge_attr={
            'color': '#666666',
            'penwidth': '2',
            'arrowsize': '0.8'
        }
    )
    
    # Color scheme for different service types
    colors = {
        'compute': '#FF9900',      # Orange for Lambda
        'storage': '#232F3E',      # Dark blue for S3
        'database': '#3F8624',     # Green for DynamoDB
        'network': '#8C4FFF',      # Purple for API Gateway
        'security': '#D45B07',     # Red for IAM
        'monitoring': '#FF4B8B',   # Pink for CloudWatch
        'cdn': '#4D27AA',          # Dark purple for CloudFront
        'auth': '#0073BB'          # Blue for Cognito
    }
    
    # Add services in a clean layout
    with dot.subgraph(name='cluster_frontend') as frontend:
        frontend.attr(label='Frontend', style='filled', color='lightgray', fontsize='14', fontweight='bold')
        frontend.node('react', 'React App', fillcolor=colors['compute'])
    
    with dot.subgraph(name='cluster_network') as network:
        network.attr(label='Network & Security', style='filled', color='lightgray', fontsize='14', fontweight='bold')
        network.node('cloudfront', 'CloudFront CDN', fillcolor=colors['cdn'])
        network.node('apigateway', 'API Gateway', fillcolor=colors['network'])
        network.node('cognito', 'Cognito', fillcolor=colors['auth'])
        network.node('iam', 'IAM', fillcolor=colors['security'])
    
    with dot.subgraph(name='cluster_backend') as backend:
        backend.attr(label='Backend Services', style='filled', color='lightgray', fontsize='14', fontweight='bold')
        backend.node('lambda_posts', 'Posts Lambda', fillcolor=colors['compute'])
        backend.node('lambda_users', 'Users Lambda', fillcolor=colors['compute'])
        backend.node('lambda_connections', 'Connections Lambda', fillcolor=colors['compute'])
        backend.node('lambda_upload', 'Upload Lambda', fillcolor=colors['compute'])
    
    with dot.subgraph(name='cluster_data') as data:
        data.attr(label='Data & Storage', style='filled', color='lightgray', fontsize='14', fontweight='bold')
        data.node('s3', 'S3 Storage', fillcolor=colors['storage'])
        data.node('dynamodb_posts', 'Posts Table', fillcolor=colors['database'])
        data.node('dynamodb_users', 'Users Table', fillcolor=colors['database'])
        data.node('dynamodb_connections', 'Connections Table', fillcolor=colors['database'])
        data.node('cloudwatch', 'CloudWatch', fillcolor=colors['monitoring'])
    
    # Simple connections
    dot.edge('react', 'cloudfront')
    dot.edge('cloudfront', 'apigateway')
    dot.edge('apigateway', 'lambda_posts')
    dot.edge('apigateway', 'lambda_users')
    dot.edge('apigateway', 'lambda_connections')
    dot.edge('apigateway', 'lambda_upload')
    dot.edge('lambda_posts', 'dynamodb_posts')
    dot.edge('lambda_users', 'dynamodb_users')
    dot.edge('lambda_connections', 'dynamodb_connections')
    dot.edge('lambda_upload', 's3')
    dot.edge('lambda_posts', 's3')
    
    # Render the diagram
    output_file = 'minimalistic_aws_architecture'
    dot.render(output_file, cleanup=True)
    return f"{output_file}.png"

def main():
    print("🚀 AWS Architecture Diagram Generator")
    print("=" * 50)
    print()
    
    # Generate minimalistic architecture
    print("📊 Generating Minimalistic AWS Architecture...")
    minimalistic_file = create_minimalistic_aws_architecture()
    print(f"✅ Minimalistic architecture diagram saved as: {minimalistic_file}")
    print()
    
    print("✅ Diagram generated successfully!")
    print()
    print("📁 Generated file:")
    print(f"  - {minimalistic_file}")

if __name__ == "__main__":
    main() 