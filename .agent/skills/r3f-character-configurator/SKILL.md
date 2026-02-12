---
name: r3f-character-configurator
description: Vite + React Three Fiber + Mantineを利用したキャラクター作成・カスタマイズ画面の実装ガイド
---

# SKILL: R3F Character Configurator

React Three Fiber と Mantine を使用して、プレイヤーがキャラクターの見た目（髪色、服の色など）をカスタマイズできる画面を実装します。

## 主な特徴

- **Human-First**: デフォルトで人間型の3Dモデル（プリミティブで構成）を表示し、すぐにカスタマイズを開始できます。ゼロからの造形は不要です。
- **Context Management**: 色やカメラモードの状態を一元管理し、3DシーンとUI（Mantine）を同期させます。
- **Camera Presets**: 「顔」「上半身」「下半身」などのボタンでカメラ位置をスムーズに移動させ、カスタマイズ箇所にフォーカスします。

## 使用する技術スタック

- React 18, Vite
- @react-three/fiber, @react-three/drei
- @mantine/core, @mantine/hooks
- @tabler/icons-react
- Zustand (推奨) または React Context

## 実装手順 (Quick Start)

以下の `.agent/skills/r3f-character-configurator/examples/` 内にあるサンプルコードをコピーして利用してください。

### 1. 依存関係のインストール

```bash
npm install three @types/three @react-three/fiber @react-three/drei @mantine/core @mantine/hooks @tabler/icons-react
```

### 2. コンポーネントの配置

以下の構成でファイルを配置します。

- `CharacterCustomizationContext.jsx`: 状態管理（色、カメラモード）
- `HumanModel.jsx`: 3Dモデル（球や直方体で構成された人間）
- `ConfiguratorInterface.jsx`: UIパネル（色選択、カメラ切り替え）
- `CharacterCreatorScene.jsx`: メインシーン（CanvasとContextの結合）

### 3. 各ファイルの役割と実装

#### A. State Management (Context)

色の変更やカメラモード（Head/Body/Legs）を管理します。
[See Code: examples/CharacterCustomizationContext.jsx](examples/CharacterCustomizationContext.jsx)

#### B. 3D Model (HumanModel)

プリミティブ（Sphere, Box, Cylinder）を組み合わせて人間型を構築します。GLBモデルが手元になくても動作するように設計されています。
[See Code: examples/HumanModel.jsx](examples/HumanModel.jsx)

#### C. UI Overlay (ConfiguratorInterface)

Mantineのコンポーネントを使用して、キャンバスの上にUIをオーバーレイ表示します。
[See Code: examples/ConfiguratorInterface.jsx](examples/ConfiguratorInterface.jsx)

#### D. Main Scene & Camera Logic

Canvasの設定と、Contextを3Dシーン内に渡すためのブリッジ処理を行います。
[See Code: examples/CharacterCreatorScene.jsx](examples/CharacterCreatorScene.jsx)

## 応用: GLBモデルへの差し替え

`HumanModel.jsx` を以下のように変更することで、自作の `character.glb` を読み込むことができます。

```jsx
const { nodes, materials } = useGLTF("/character.glb");

// マテリアルの色をContextの色で上書きする例
materials.Shirt.color.set(characterConfig.shirtColor);
```

## 注意点

- **R3F Context Bridge**: `Canvas` は独自のレンダリングツリーを持つため、外側の Context を内部で使用するには Bridge（Providerの再配置）が必要です（`CharacterCreatorScene.jsx` 参照）。
- **Screenshot**: スクリーンショット機能を実装する場合は `gl.preserveDrawingBuffer: true` を Canvas に設定してください。

---

## 完了条件

1. キャラクターが表示されること。
2. UIで色を変更すると、即座に3Dモデルに反映されること。
3. カメラボタン（Head, Body等）を押すとスムーズに視点が移動すること。
