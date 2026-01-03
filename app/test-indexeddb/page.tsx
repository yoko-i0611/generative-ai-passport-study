'use client';

import { useState, useEffect } from 'react';
import { 
  openDatabase, 
  saveAnswer, 
  getAllAnswers, 
  getAnswersByChapter,
  exportAnswers,
  importAnswers,
  clearDatabase 
} from '@/app/lib/indexeddb';

export default function TestIndexedDBPage() {
  const [status, setStatus] = useState<string>('準備中...');
  const [answers, setAnswers] = useState<any[]>([]);
  const [exportData, setExportData] = useState<string>('');

  useEffect(() => {
    checkDatabase();
  }, []);

  const checkDatabase = async () => {
    try {
      const db = await openDatabase();
      setStatus('✅ データベース接続成功');
      await loadAnswers();
    } catch (error) {
      console.error('データベースエラー:', error);
      setStatus('❌ データベース接続エラー: ' + (error as Error).message);
    }
  };

  const loadAnswers = async () => {
    try {
      const allAnswers = await getAllAnswers();
      setAnswers(allAnswers);
    } catch (error) {
      console.error('読み込みエラー:', error);
    }
  };

  const handleSaveTestAnswer = async () => {
    try {
      await saveAnswer({
        questionId: `test-question-${Date.now()}`,
        chapterId: 1,
        unitId: 1,
        selectedOption: 1,
        isCorrect: true,
        timeSpent: 30,
        retryCount: 0,
      });
      setStatus('✅ テスト回答を保存しました');
      await loadAnswers();
    } catch (error) {
      console.error('保存エラー:', error);
      setStatus('❌ 保存エラー: ' + (error as Error).message);
    }
  };

  const handleExport = async () => {
    try {
      const data = await exportAnswers();
      setExportData(data);
      setStatus('✅ エクスポート完了');
    } catch (error) {
      console.error('エクスポートエラー:', error);
      setStatus('❌ エクスポートエラー: ' + (error as Error).message);
    }
  };

  const handleImport = async () => {
    if (!exportData) {
      setStatus('❌ エクスポートデータがありません');
      return;
    }
    try {
      await importAnswers(exportData);
      setStatus('✅ インポート完了');
      await loadAnswers();
    } catch (error) {
      console.error('インポートエラー:', error);
      setStatus('❌ インポートエラー: ' + (error as Error).message);
    }
  };

  const handleClear = async () => {
    if (!confirm('すべてのデータを削除しますか？')) return;
    try {
      await clearDatabase();
      setStatus('✅ データをクリアしました');
      await loadAnswers();
    } catch (error) {
      console.error('クリアエラー:', error);
      setStatus('❌ クリアエラー: ' + (error as Error).message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">IndexedDB テストページ</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">ステータス</h2>
          <p className="text-gray-700">{status}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">操作</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleSaveTestAnswer}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              テスト回答を保存
            </button>
            <button
              onClick={loadAnswers}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              回答を読み込み
            </button>
            <button
              onClick={handleExport}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg"
            >
              エクスポート
            </button>
            <button
              onClick={handleImport}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
            >
              インポート
            </button>
            <button
              onClick={handleClear}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              データをクリア
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">保存されている回答 ({answers.length}件)</h2>
          <div className="space-y-2">
            {answers.length === 0 ? (
              <p className="text-gray-500">データがありません</p>
            ) : (
              answers.map((answer, index) => (
                <div key={answer.id} className="border-b pb-2">
                  <div className="flex justify-between">
                    <span className="font-medium">質問ID: {answer.questionId}</span>
                    <span className={`px-2 py-1 rounded ${answer.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {answer.isCorrect ? '正解' : '不正解'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    第{answer.chapterId}章 | 時間: {answer.timeSpent}秒 | リトライ: {answer.retryCount}回
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {exportData && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">エクスポートデータ</h2>
            <textarea
              value={exportData}
              readOnly
              className="w-full h-40 p-2 border rounded font-mono text-sm"
            />
          </div>
        )}
      </div>
    </div>
  );
}


