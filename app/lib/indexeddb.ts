import { openDB, DBSchema, IDBPDatabase } from 'idb';

// IndexedDBスキーマ定義
interface AnswerDB extends DBSchema {
  userAnswers: {
    key: string; // questionId + userId の組み合わせ
    value: {
      id: string;
      userId: string;
      questionId: string;
      chapterId: number;
      unitId: number;
      selectedOption: number;
      isCorrect: boolean;
      timeSpent: number; // 秒
      timestamp: Date;
      retryCount: number;
    };
    indexes: {
      'by-chapter': number;
      'by-user': string;
      'by-timestamp': Date;
    };
  };
  userSettings: {
    key: string;
    value: {
      userId: string;
      createdAt: Date;
      lastSyncAt?: Date;
    };
  };
}

// データベース名とバージョン
const DB_NAME = 'ai-learning-platform';
const DB_VERSION = 1;

// ユーザーIDを取得（簡易版：localStorageから取得、なければ生成）
const getUserId = (): string => {
  if (typeof window === 'undefined') return 'default-user';
  
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('userId', userId);
  }
  return userId;
};

// データベースを開く
export const openDatabase = async (): Promise<IDBPDatabase<AnswerDB>> => {
  return openDB<AnswerDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // userAnswersストアの作成
      if (!db.objectStoreNames.contains('userAnswers')) {
        const answerStore = db.createObjectStore('userAnswers', {
          keyPath: 'id',
        });
        answerStore.createIndex('by-chapter', 'chapterId');
        answerStore.createIndex('by-user', 'userId');
        answerStore.createIndex('by-timestamp', 'timestamp');
      }

      // userSettingsストアの作成
      if (!db.objectStoreNames.contains('userSettings')) {
        db.createObjectStore('userSettings', {
          keyPath: 'userId',
        });
      }
    },
  });
};

// 回答を保存
export const saveAnswer = async (answer: {
  questionId: string;
  chapterId: number;
  unitId: number;
  selectedOption: number;
  isCorrect: boolean;
  timeSpent: number;
  retryCount?: number;
}): Promise<void> => {
  const db = await openDatabase();
  const userId = getUserId();
  const id = `${answer.questionId}-${userId}`;
  
  // 既存の回答を確認
  const existing = await db.get('userAnswers', id);
  const retryCount = existing ? (existing.retryCount + 1) : (answer.retryCount || 0);

  await db.put('userAnswers', {
    id,
    userId,
    questionId: answer.questionId,
    chapterId: answer.chapterId,
    unitId: answer.unitId,
    selectedOption: answer.selectedOption,
    isCorrect: answer.isCorrect,
    timeSpent: answer.timeSpent,
    timestamp: new Date(),
    retryCount,
  });
};

// 章別の回答を取得
export const getAnswersByChapter = async (chapterId: number): Promise<any[]> => {
  const db = await openDatabase();
  const userId = getUserId();
  
  const tx = db.transaction('userAnswers', 'readonly');
  const index = tx.store.index('by-chapter');
  const allAnswers = await index.getAll(chapterId);
  
  // ユーザーの回答のみをフィルタ
  return allAnswers.filter(answer => answer.userId === userId);
};

// すべての回答を取得
export const getAllAnswers = async (): Promise<any[]> => {
  const db = await openDatabase();
  const userId = getUserId();
  
  const tx = db.transaction('userAnswers', 'readonly');
  const index = tx.store.index('by-user');
  return index.getAll(userId);
};

// 回答をエクスポート（JSON形式）
export const exportAnswers = async (): Promise<string> => {
  const answers = await getAllAnswers();
  return JSON.stringify(answers, null, 2);
};

// 回答をインポート（JSON形式）
export const importAnswers = async (jsonData: string): Promise<void> => {
  const db = await openDatabase();
  const answers = JSON.parse(jsonData);
  
  const tx = db.transaction('userAnswers', 'readwrite');
  for (const answer of answers) {
    await tx.store.put(answer);
  }
  await tx.done;
};

// データベースをクリア
export const clearDatabase = async (): Promise<void> => {
  const db = await openDatabase();
  const userId = getUserId();
  
  const tx = db.transaction('userAnswers', 'readwrite');
  const index = tx.store.index('by-user');
  const userAnswers = await index.getAll(userId);
  
  for (const answer of userAnswers) {
    await tx.store.delete(answer.id);
  }
  await tx.done;
};


