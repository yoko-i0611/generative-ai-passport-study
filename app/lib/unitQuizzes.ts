// ユニットごとの確認テストデータを読み込むユーティリティ

export interface UnitQuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface UnitQuizSection {
  chapter: number;
  sectionId: string;
  sectionTitle: string;
  questions: UnitQuizQuestion[];
}

// publicディレクトリからユニットごとの確認テストデータを読み込む
export async function loadUnitQuizzes(): Promise<UnitQuizSection[]> {
  try {
    const response = await fetch('/unit_quizzes_all.json');
    if (!response.ok) {
      console.error(`ユニットごとの確認テストデータの読み込みに失敗しました: ${response.status} ${response.statusText}`);
      return []; // エラー時は空の配列を返す
    }
    const data: UnitQuizSection[] = await response.json();
    return data || [];
  } catch (error) {
    console.error('ユニットごとの確認テストデータの読み込みエラー:', error);
    return []; // エラー時は空の配列を返す
  }
}

// 章ごとにユニットをグループ化
export function groupUnitQuizzesByChapter(unitQuizzes: UnitQuizSection[]): Record<number, UnitQuizSection[]> {
  const grouped: Record<number, UnitQuizSection[]> = {};
  unitQuizzes.forEach(unit => {
    if (!grouped[unit.chapter]) {
      grouped[unit.chapter] = [];
    }
    grouped[unit.chapter].push(unit);
  });
  return grouped;
}

// sectionIdからユニット情報を取得
export function getUnitQuizBySectionId(sectionId: string, unitQuizzes: UnitQuizSection[]): UnitQuizSection | undefined {
  return unitQuizzes.find(unit => unit.sectionId === sectionId);
}

// 章番号からユニットリストを取得
export function getUnitQuizzesByChapter(chapter: number, unitQuizzes: UnitQuizSection[]): UnitQuizSection[] {
  return unitQuizzes.filter(unit => unit.chapter === chapter);
}


