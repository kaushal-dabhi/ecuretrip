#!/usr/bin/env tsx

import { execSync } from 'child_process';
import * as fs from 'fs';

async function setupPACS() {
  console.log('🖼️ Setting up PACS (Orthanc) system...');

  try {
    // Create PACS configuration
    const pacsConfig = {
      name: 'eCureTrip PACS',
      version: '1.0.0',
      orthanc: {
        url: 'http://localhost:8042',
        username: 'orthanc',
        password: 'orthanc',
        aet: 'ECURETRIP'
      },
      dicom: {
        port: 4242,
        aet: 'ECURETRIP',
        maxAssociations: 10
      },
      storage: {
        path: './public/uploads/dicom',
        maxSize: '10GB'
      }
    };

    fs.writeFileSync('config/pacs-config.json', JSON.stringify(pacsConfig, null, 2));
    console.log('✅ PACS configuration created');

    // Create DICOM viewer component
    const dicomViewer = `
import React, { useEffect, useRef } from 'react';
import * as cornerstone from 'cornerstone-core';
import * as cornerstoneTools from 'cornerstone-tools';
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';

interface DICOMViewerProps {
  studyId: string;
  imageId: string;
}

export default function DICOMViewer({ studyId, imageId }: DICOMViewerProps) {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      cornerstone.enable(canvasRef.current);
      
      const wadoURL = \`http://localhost:8042/wado?requestType=WADO&studyUID=\${studyId}&seriesUID=\${imageId}&objectUID=\${imageId}\`;
      
      cornerstone.loadImage(wadoURL).then((image) => {
        cornerstone.displayImage(canvasRef.current!, image);
        cornerstoneTools.init();
      });
    }

    return () => {
      if (canvasRef.current) {
        cornerstone.disable(canvasRef.current);
      }
    };
  }, [studyId, imageId]);

  return (
    <div className="dicom-viewer">
      <div ref={canvasRef} className="cornerstone-canvas" />
    </div>
  );
}
`;

    fs.writeFileSync('components/DICOMViewer.tsx', dicomViewer);
    console.log('✅ DICOM viewer component created');

    console.log('✅ PACS setup completed!');
    console.log('📋 Next: Install Orthanc PACS server and configure DICOM routing');

  } catch (error) {
    console.error('❌ PACS setup failed:', error);
  }
}

setupPACS();
