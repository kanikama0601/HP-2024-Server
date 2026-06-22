"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRecycle, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const bins = [
  {
    color: "bg-blue-100 border-blue-300",
    label: "燃えるゴミ",
    emoji: "🗑️",
    examples: ["食べ残し", "紙くず", "割り箸・爪楊枝", "汚れた紙皿・紙コップ"],
  },
  {
    color: "bg-yellow-100 border-yellow-300",
    label: "プラスチック",
    emoji: "♻️",
    examples: ["ペットボトルのキャップ", "レジ袋・ビニール袋", "食品トレー（軽くすすいで）", "プラマーク付き容器"],
  },
  {
    color: "bg-green-100 border-green-300",
    label: "ペットボトル",
    emoji: "🧴",
    examples: ["飲料用ペットボトル（ラベル・キャップ除く）"],
    note: "中をすすいでからお捨てください",
  },
  {
    color: "bg-gray-100 border-gray-300",
    label: "缶・ビン",
    emoji: "🥫",
    examples: ["アルミ缶・スチール缶", "ガラスビン"],
    note: "中をすすいでからお捨てください",
  },
  {
    color: "bg-red-100 border-red-300",
    label: "燃えないゴミ",
    emoji: "🚯",
    examples: ["割れたガラス", "陶器のかけら", "金属類"],
  },
];

export default function Recycle() {
  return (
    <main>
      <div className="mx-3.5 my-10">
        <div className="container mx-auto text-white text-center m-12">
          <h2 className="text-3xl font-light text-shadow-md m-3">
            <FontAwesomeIcon icon={faRecycle} /> 分別について
          </h2>
          <p className="text-sm mb-4">ゴミの正しい分け方</p>
        </div>
        <div className="container mx-auto md:w-6/12 w-full space-y-4">

          <div className="w-full p-6 bg-white rounded-lg">
            <p className="text-sm text-gray-700 leading-7">
              電波祭ではゴミの分別にご協力をお願いしています。<br />
              各ゴミ箱にはラベルを貼っていますので、正しい分別にご協力ください。
            </p>
          </div>

          {bins.map(({ color, label, emoji, examples, note }) => (
            <div key={label} className={`w-full p-6 bg-white rounded-lg border-l-4 ${color}`}>
              <h3 className="text-base font-bold text-gray-800 mb-2">{emoji} {label}</h3>
              <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                {examples.map((ex) => <li key={ex}>{ex}</li>)}
              </ul>
              {note && <p className="text-xs text-gray-500 mt-2">※ {note}</p>}
            </div>
          ))}

          <div className="w-full p-6 bg-white rounded-lg">
            <h3 className="text-base font-bold text-gray-800 mb-2">⚠️ お願い</h3>
            <p className="text-sm text-gray-700 leading-7">
              分別が難しい場合は「燃えるゴミ」へお入れください。<br />
              案内所スタッフへお気軽にご質問ください。<br />
              皆さまのご協力をよろしくお願いいたします。
            </p>
          </div>

        </div>
        <Link href="/" className="block text-center mt-8">
          <p className="text-white"><FontAwesomeIcon icon={faChevronLeft} /> トップへ戻る</p>
        </Link>
      </div>
    </main>
  );
}
