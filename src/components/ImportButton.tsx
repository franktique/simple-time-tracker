'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { importAPI, ExportData } from '@/lib/api-client';
import { ConfirmDialog } from './ConfirmDialog';

export function ImportButton() {
  const [isImporting, setIsImporting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingData, setPendingData] = useState<ExportData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text) as ExportData;

      // Basic validation
      if (!data.version || !data.data) {
        throw new Error('Invalid file format');
      }

      // Show confirmation dialog
      setPendingData(data);
      setShowConfirm(true);
    } catch (error) {
      console.error('Error reading import file:', error);
      alert('Failed to read import file. Please ensure it is a valid JSON export file.');
    } finally {
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleConfirmImport = async () => {
    if (!pendingData) return;

    try {
      setIsImporting(true);
      setShowConfirm(false);

      const response = await importAPI.uploadData(pendingData);

      alert(
        `Import successful!\n\n` +
        `Tasks: ${response.stats.tasks}\n` +
        `Time Entries: ${response.stats.timeEntries}\n` +
        `Check Entries: ${response.stats.checkEntries}\n` +
        `Active Timers: ${response.stats.activeTimers}`
      );

      // Reload the page to reflect imported data
      window.location.reload();
    } catch (error) {
      console.error('Error importing data:', error);
      alert('Failed to import data. Please try again.');
      setIsImporting(false);
    }
  };

  const handleCancelImport = () => {
    setShowConfirm(false);
    setPendingData(null);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      <Button
        variant="outline"
        size="sm"
        onClick={handleButtonClick}
        disabled={isImporting}
        className="gap-2"
      >
        <Upload className="w-4 h-4" />
        {isImporting ? 'Importing...' : 'Import'}
      </Button>

      <ConfirmDialog
        isOpen={showConfirm}
        title="Import Data"
        message="This will replace all existing data with the imported data. This action cannot be undone. Are you sure you want to continue?"
        confirmLabel="Import"
        cancelLabel="Cancel"
        variant="destructive"
        onConfirm={handleConfirmImport}
        onCancel={handleCancelImport}
      />
    </>
  );
}
