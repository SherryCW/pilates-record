import { useEffect, useMemo, useState } from 'react'
import './App.css'

type EquipmentKind = '塔架' | '垫上' | 'Ladder Barrel' | '小器械' | 'Wunda Chair' | 'Reformer' | '其他'
type MuscleGroup = '胸部' | '肩部' | '手臂' | '腹部' | '背部' | '臀部' | '髋部' | '股四' | '腘绳' | '小腿'
type ReformerCategory = '全部' | '仰卧·脚踏与跳跃' | '仰卧·脚套' | '仰卧·手臂' | '仰卧·核心与桥' | '坐姿系' | '短箱系列' | '俯卧系' | '跪姿系' | '侧向与站姿' | '倒立与高阶'
type Exercise = { id: number; en: string; zh: string; image: string; kind: EquipmentKind; sprite?: string; tileX?: number; tileY?: number; spriteCols?: number; spriteRows?: number; customMuscles?: MuscleGroup[] }
type SetEntry = { spring: string; reps: string }
const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`
const springOptions = ['红弹簧', '绿弹簧', '黄弹簧', '空']

const towerExercises: Exercise[] = [
  ['Roll Down', '卷腹下拉'], ['Push Through Front', '推杆前推'], ['Push Through Reverse', '推杆反向'], ['Tower', '塔式'], ['Monkey', '猴式'],
  ['Leg Springs Frogs', '腿弹簧蛙式'], ['Leg Springs Circles', '腿弹簧画圈'], ['Leg Springs Walking', '腿弹簧行走'], ['Leg Spring Beats', '腿弹簧拍击'], ['Arm Springs Supine', '仰卧手臂弹簧'],
  ['Arm Springs Kneeling', '跪姿手臂弹簧'], ['Chest Expansion', '胸部扩展（跪姿）'], ['Thigh Stretch', '大腿伸展'], ['Cat', '猫式'], ['Mermaid', '美人鱼式'],
  ['Parakeet', '鹦鹉式'], ['Breathing', '呼吸式'], ['Teaser with Push-Through Bar', '推杆V形平衡'], ['Hanging Pull Ups', '悬垂引体'], ['Spread Eagle', '展翅式'],
].map((item, index) => ({ id: index + 1, en: item[0], zh: item[1], image: assetUrl(`assets/exercises/${index + 1}.png?v=5`), kind: '塔架' as const }))

// 塔架附加动作：原先与其它器械共用 more-exercises 雪碧图，现按垫上的结构改成
// 一个动作一张独立图片，编号接在 20 个主动作之后（21-23）。
const towerExtraExercises: Exercise[] = [
  { id: 103, kind: '塔架', en: 'Standing Arm Press', zh: '站姿手臂推压', image: assetUrl('assets/exercises/21.png?v=5') },
  { id: 104, kind: '塔架', en: 'Roll Back', zh: '塔架后卷', image: assetUrl('assets/exercises/22.png?v=5') },
  { id: 105, kind: '塔架', en: 'Hip Opener', zh: '髋部打开', image: assetUrl('assets/exercises/23.png?v=5') },
]

// 塔架胸部扩展的站姿版本，作为独立动作与跪姿版并存，紧跟在跪姿版之后展示。
// 编号 24 接在塔架现有编号之后，展示位置由下面 exercises 数组里的插入点决定。
const towerChestExpansionStanding: Exercise = { id: 315, kind: '塔架', en: 'Chest Expansion (Standing)', zh: '胸部扩展（站姿）', image: assetUrl('assets/exercises/24.png?v=1') }

const matNames: [string, string][] = [
  ['The Hundred', '百次呼吸（标准）'], ['Roll Up', '卷脊起身'], ['Roll Over', '翻滚'], ['One Leg Circle', '单腿画圈'], ['Rolling Like a Ball', '像球一样滚动'], ['Single Leg Stretch', '单腿伸展'], ['Double Leg Stretch', '双腿伸展'], ['Spine Stretch Forward', '脊柱前伸展'], ['Open Leg Rocker', '开腿摇摆'], ['Corkscrew', '螺旋转'], ['Saw', '锯式'], ['Swan Dive', '天鹅俯冲'], ['Single Leg Kick', '单腿踢'], ['Double Leg Kick', '双腿踢'], ['Neck Pull', '颈部牵拉'], ['Scissors', '剪刀式'], ['Bicycle', '自行车式'], ['Shoulder Bridge', '肩桥'], ['Spine Twist', '脊柱扭转'], ['Jackknife', '折刀式'], ['Side Kick', '侧踢系列'], ['Teaser', 'V形平衡'], ['Hip Twist', '髋部扭转'], ['Swimming', '游泳式'], ['Leg Pull Front', '前侧腿拉'], ['Leg Pull Back', '后侧腿拉'], ['Side Kick Kneeling', '跪姿侧踢'], ['Side Bend', '侧弯支撑'], ['Boomerang', '回旋木马'], ['Seal', '海豹式'], ['Crab', '螃蟹式'], ['Rocking', '摇摆式'], ['Control Balance', '控制平衡'], ['Push Up', '普拉提俯卧撑'],
]
const matExercises: Exercise[] = matNames.map(([en, zh], index) => ({ id: 21 + index, en, zh, image: assetUrl(`assets/mat/${index + 1}.png?v=6`), kind: '垫上' as const }))

// 百次呼吸的降阶版本（桌面腿）。作为独立动作与标准版并存，紧跟在标准版之后展示。
// 编号 46 接在垫上现有编号之后，展示位置由下面 exercises 数组里的插入点决定。
const matHundredTabletop: Exercise = { id: 314, kind: '垫上', en: 'The Hundred (Tabletop)', zh: '百次呼吸（桌面腿）', image: assetUrl('assets/mat/46.png?v=1') }
// 单腿画圈挪到单腿抬升后面展示（垫上单腿一对）。
const oneLegCircleMat: Exercise = { id: 24, kind: '垫上', en: 'One Leg Circle', zh: '单腿画圈', image: assetUrl('assets/mat/4.png?v=6') }
const matExtraExercises: Exercise[] = [
  ['Half Roll Back', '半卷脊后倒', 'half-roll-back.png'],
  ['Chest Lift', '胸部抬升', 'chest-lift.png'],
  ['Single Leg Lift', '单腿抬升', 'single-leg-lift.png'],
  ['Toe Taps', '脚尖点地', 'toe-taps.png'],
  ['Side-Lying Leg Series', '侧卧腿部系列', 'side-lying-leg-series.png'],
  ['Clam', '蚌式开合', 'clam.png'],
  ['Dart', '飞镖式', 'dart.png'],
  ['Mat Mermaid', '垫上美人鱼式', 'mat-mermaid.png'],
].map(([en, zh, file], index) => ({ id: 230 + index, en, zh, image: assetUrl(`assets/mat-extra/${file}?v=1`), kind: '垫上' as const }))
const extraSets: { kind: EquipmentKind; folder: string; names: [string, string][] }[] = [
  { kind: 'Ladder Barrel', folder: 'ladder-barrel', names: [['Swan', '天鹅式'], ['Ballet Stretch', '芭蕾伸展'], ['Side Sit Up', '侧坐起身'], ['Backward Stretch', '后弯伸展'], ['Short Box Round', '短箱圆背'], ['Tree', '树式'], ['Leg Circles', '腿部画圈'], ['Hamstring Stretch', '腿后侧伸展'], ['Hip Flexor Stretch', '髋屈肌伸展']] },
  { kind: '小器械', folder: 'small-apparatus', names: [['Magic Circle Chest Press', '普拉提圈胸推'], ['Supine Bent-Knee Magic Circle Inner Thigh Squeeze', '仰卧屈膝普拉提圈内收'], ['Magic Circle Bridge Squeeze', '普拉提圈桥式'], ['Magic Circle Overhead Press', '普拉提圈过顶推'], ['Magic Circle Side Leg Press', '普拉提圈侧腿推'], ['Magic Circle Teaser', '普拉提圈V形平衡'], ['Small Ball Ab Curl', '小球腹部卷曲'], ['Small Ball Bridge', '小球桥式'], ['Resistance Band Row', '弹力带划船'], ['Resistance Band Leg Press', '弹力带腿推'], ['Foam Roller Balance', '泡沫轴平衡'], ['Foam Roller Arm Arcs', '泡沫轴手臂画圈']] },
  { kind: 'Wunda Chair', folder: 'wunda-chair', names: [['Footwork', '脚步练习'], ['Pull Up', '上拉'], ['Going Up Front', '前侧上台'], ['Going Up Side', '侧向上台'], ['Mountain Climb', '登山式'], ['Swan Front', '前侧天鹅'], ['Mermaid', '美人鱼式'], ['Teaser', 'V形平衡'], ['Tendon Stretch', '肌腱伸展'], ['Pike', '折叠支撑'], ['Press Down', '下压']] },
  { kind: 'Reformer', folder: 'reformer', names: [['Footwork', '脚步练习'], ['The Hundred', '百次呼吸'], ['Frog', '蛙式'], ['Leg Circles', '腿部画圈'], ['Short Spine', '短脊柱'], ['Long Stretch', '长伸展'], ['Elephant', '大象式'], ['Knee Stretches', '跪姿伸展'], ['Long Box Pulling Straps', '长箱拉绳'], ['Backstroke', '仰卧划水'], ['Teaser', 'V形平衡'], ['Mermaid', '美人鱼式']] },
]
// Reformer 这一组的 12 个动作已全部由 reformerAlignedImages 换成独立整图
// （assets/reformer/N.png），不再需要雪碧图；其余三组仍用 4x3 雪碧图。
const extraExercises: Exercise[] = extraSets.flatMap(({ kind, folder, names }, setIndex) => names.map(([en, zh], index) => ({ id: 55 + setIndex * 12 + index, en, zh, image: assetUrl(`assets/${folder}/${index + 1}.png?v=1`), ...((kind === 'Reformer' || kind === 'Wunda Chair') ? {} : { sprite: assetUrl(`assets/${folder}/${folder}-clean.png?v=1`), tileX: index % 4, tileY: Math.floor(index / 4) }), kind })))
const extraExercisesWithCustomImages: Exercise[] = extraExercises.map(exercise => {
  // Reformer 的四条特例（The Hundred / Frog / Long Box Pulling Straps / Backstroke）
  // 已由 reformerAlignedImages 统一接管，不再需要单独覆盖。
  if (exercise.kind === '小器械' && exercise.en === 'Supine Bent-Knee Magic Circle Inner Thigh Squeeze') return { ...exercise, image: assetUrl('assets/small-apparatus/magic-circle-inner-thigh-squeeze-supine.png?v=3'), sprite: undefined, tileX: undefined, tileY: undefined }
  if (exercise.kind === '小器械' && exercise.en === 'Magic Circle Side Leg Press') return { ...exercise, image: assetUrl('assets/small-apparatus/magic-circle-side-leg-press.png?v=3'), sprite: undefined, tileX: undefined, tileY: undefined }
  if (exercise.kind === '小器械' && exercise.en === 'Resistance Band Leg Press') return { ...exercise, image: assetUrl('assets/small-apparatus/resistance-band-leg-press.png?v=1'), sprite: undefined, tileX: undefined, tileY: undefined }
  if (exercise.kind === '小器械') return { ...exercise, sprite: undefined, tileX: undefined, tileY: undefined }
  return exercise
})
const reformerExpansionNames: [string, string][] = [
  ['Rowing Into the Sternum', '划船入胸骨'], ['Rowing 90 Degrees', '90度划船'], ['Rowing From the Chest', '胸前划船'], ['Rowing From the Hips', '髋部划船'],
  ['Shaving', '剃须式'], ['Hug', '拥抱式'], ['Short Box Round Back', '短箱圆背'], ['Short Box Flat Back', '短箱平背'],
  ['Short Box Side to Side', '短箱侧屈'], ['Short Box Twist and Reach', '短箱扭转伸展'], ['Gone Fishing', '钓鱼式（叉鱼）'], ['Tree / Climb-a-Tree', '爬树式'],
  ['Breaststroke', '蛙泳式'], ['Hamstring Curls', '腘绳肌弯曲'], ['Horseback', '骑马式'],
  ['Side Sit Ups', '侧仰卧起坐'], ['Overhead', '过顶式'], ['Corkscrew', '螺旋式'], ['Tic Toc', '钟摆式'],
  ['Control Balance Off', '离床控制平衡'], ['Grasshopper', '蚱蜢式'], ['Swimming', '游泳式'], ['Rocking', '摇摆式'],
  ['Single Leg Elephant', '单腿大象式'], ['Arabesque', '阿拉伯式'], ['Long Back Stretch', '长背伸展'], ['Stomach Massage Round', '胃部按摩圆背'],
  ['Stomach Massage Hands Back', '胃部按摩手后撑'], ['Stomach Massage Reach Up', '胃部按摩上伸'], ['Stomach Massage Twist', '胃部按摩扭转'], ['Tendon Stretch', '肌腱伸展'],
  ['Tendon Stretch Side', '侧向肌腱伸展'],
  ['Chest Expansion', '胸部扩展'], ['Thigh Stretch', '大腿伸展'], ['Backbend to Bar', '后弯至脚杆'], ['Arm Circles', '手臂画圈'],
  ['Snake', '蛇式'], ['Twist', '蛇式扭转'], ['Knee Stretches Knees Off', '膝部伸展离膝'], ['Footbar Plank Box Slide', '脚踩脚板箱上前向移动'],
  ['Footbar Reverse Plank Box Slide', '脚踩脚板箱上后向移动'], ['Star', '星式'], ['Front Splits', '前劈腿'], ['Russian Splits', '俄式劈腿'],
]
const reformerExpansionCustomImages: Record<string, string> = {
  'Short Box Round Back': 'assets/reformer-expansion/short-box-round-back.png?v=2',
  'Short Box Flat Back': 'assets/reformer-custom/short-box-flat-back-v2.png?v=1',
  'High Frog': 'assets/reformer-expansion/high-frog.png?v=3',
  'Hamstring Curls': 'assets/reformer-custom/hamstring-curls.png?v=1',
  Breaststroke: 'assets/reformer-custom/breaststroke.png?v=1',
  'Thigh Stretch': 'assets/reformer-custom/thigh-stretch.png?v=1',
  'Semi Circle': 'assets/reformer-custom/semi-circle.png?v=2',
  'Short Box Side to Side': 'assets/reformer-custom/short-box-side-to-side.png?v=1',
  'Short Box Twist and Reach': 'assets/reformer-custom/short-box-twist-and-reach.png?v=1',
  Hug: 'assets/reformer-custom/hug.png?v=1',
  'Stomach Massage Round': 'assets/reformer-custom/stomach-massage-round.png?v=1',
  'Stomach Massage Hands Back': 'assets/reformer-custom/stomach-massage-hands-back.png?v=1',
  'Stomach Massage Reach Up': 'assets/reformer-custom/stomach-massage-reach-up.png?v=1',
  'Stomach Massage Twist': 'assets/reformer-custom/stomach-massage-twist.png?v=1',
  'Backbend to Bar': 'assets/reformer-custom/backbend-to-bar.png?v=1',
  'Russian Splits': 'assets/reformer-custom/russian-splits.png?v=1',
  'Footbar Plank Box Slide': 'assets/reformer-custom/footbar-plank-box-slide.png?v=1',
  'Footbar Reverse Plank Box Slide': 'assets/reformer-custom/footbar-reverse-plank-box-slide.png?v=1',
}
const reformerExpansionExercises: Exercise[] = reformerExpansionNames.map(([en, zh], index) => ({ id: 121 + index, en, zh, image: assetUrl(reformerExpansionCustomImages[en] || `assets/reformer-expansion/${String(index + 1).padStart(2, '0')}.png`), kind: 'Reformer' as const }))
const reformerAdditionalNames: [string, string][] = [
  ['Footwork Toes', '脚趾脚踏'], ['Footwork Heels', '足跟脚踏'], ['Rowing Back', '后向划船'],
  ['Rowing Front', '前向划船'], ['Pulling Straps', '拉带'], ['Horizontal T-Pull', '水平拉带（T形）'], ['Down Stretch', '下伸展'], ['Up Stretch', '上伸展'],
  ['Knee Stretches Round', '圆背膝部伸展'], ['Knee Stretches Arched', '拱背膝部伸展'], ['Pelvic Lift', '骨盆抬升'], ['Side Splits', '侧劈腿'],
]
const reformerAdditionalCustomImages: Record<string, string> = {
  'Footwork Toes': 'assets/reformer-custom/footwork-toes.png?v=1',
  'Footwork Heels': 'assets/reformer-custom/footwork-heels.png?v=2',
  'Horizontal T-Pull': 'assets/reformer-custom/horizontal-t-pull.png?v=1',
  'Down Stretch': 'assets/reformer-custom/down-stretch.png?v=1',
}
const reformerAdditionalExercises: Exercise[] = reformerAdditionalNames.map(([en, zh], index) => ({ id: 169 + index, en, zh, image: assetUrl(reformerAdditionalCustomImages[en] || `assets/reformer-additional/${String(index + 1).padStart(2, '0')}.png?v=2?v=2`), kind: 'Reformer' as const }))
const reformerGeneratedNames: [string, string][] = [
  ['Single Leg Heel Footwork', '单腿脚跟脚踏'], ['Footwork on Footplate', '脚踏板脚步'], ['Jumping on Footplate', '脚踏板跳跃'],
  ['Supine Arm Work', '仰卧手臂练习'], ['Kneeling Abdominals Facing Back', '面向后跪姿腹部'],
  ['Kneeling Abdominals Facing Front', '面向前跪姿腹部'], ['Feet in Straps', '脚套弹簧'],
  ['Short Box Advanced Abdominals', '短箱进阶腹部'], ['Short Box Mermaid', '短箱美人鱼'],
  ['Short Box Climb a Tree', '短箱爬树'], ['Arm Work Facing Straps', '面向弹簧手臂练习'],
  ['Arm Work Facing Footbar', '面向脚杆手臂练习'], ['Kneeling Side Arms', '跪姿侧臂'], ['Lunges', '弓步'],
  ['Side Stretch / Mermaid', '侧向伸展/美人鱼'], ['Cleopatra', '克娄巴特拉式'], ['Reverse Abdominals', '反向腹部'],
  ['Footbar Plank Carriage Slide', '脚踩脚板滑床前向移动'], ['Footbar Reverse Plank Carriage Slide', '脚踩脚板滑床后向移动'], ['Side Support', '侧支撑'],
  ['Biceps Curl', '二头肌弯举'], ['Posterior Shoulder Press', '后肩推压'], ['Serve a Tray', '端盘式'], ['Scooter', '滑板车式'],
]
const reformerGeneratedCustomImages: Record<string, string> = {
  'Single Leg Heel Footwork': 'assets/reformer-custom/single-leg-heel-footwork.png?v=1',
  'Supine Arm Work': 'assets/reformer-custom/supine-arm-work.png?v=2',
  'Jumping on Footplate': 'assets/reformer-custom/jumping-on-footplate.png?v=1',
  'Footbar Plank Carriage Slide': 'assets/reformer-custom/footbar-plank-carriage-slide.png?v=1',
  'Footbar Reverse Plank Carriage Slide': 'assets/reformer-custom/footbar-reverse-plank-carriage-slide.png?v=1',
}
const reformerGeneratedExercises: Exercise[] = reformerGeneratedNames.map(([en, zh], index) => ({ id: 182 + index, en, zh, image: assetUrl(reformerGeneratedCustomImages[en] || `assets/reformer-generated/${String(index + 1).padStart(2, '0')}.png`), kind: 'Reformer' as const }))
const singleLegFootworkExercises: Exercise[] = [
  { id: 222, kind: 'Reformer', en: 'Single Leg Toe Footwork', zh: '单腿前脚掌脚踏', image: assetUrl('assets/reformer-custom/single-leg-toe-footwork.png?v=1') },
  { id: 223, kind: 'Reformer', en: 'Single Leg Footwork with Leg Lift', zh: '单腿脚踏直腿上举', image: assetUrl('assets/reformer-custom/single-leg-footwork-leg-lift.png?v=1') },
  { id: 224, kind: 'Reformer', en: 'Seated Side Arm Pull', zh: '侧坐水平拉带', image: assetUrl('assets/reformer-custom/seated-side-arm-pull.png?v=1') },
]
const describedReformerExercises: Exercise[] = [
  { id: 225, kind: 'Reformer', en: 'Seated Side Arm Pull – Feet Grounded', zh: '侧坐双脚落地水平拉带', image: assetUrl('assets/reformer-custom/seated-side-arm-pull-feet-grounded.png?v=1') },
  { id: 226, kind: 'Reformer', en: 'Teaser Arm Pull', zh: 'V型核心手臂拉带', image: assetUrl('assets/reformer-custom/teaser-arm-pull.png?v=1') },
  { id: 227, kind: 'Reformer', en: 'Side Standing Scooter', zh: '侧向45°站姿蹬滑床', image: assetUrl('assets/reformer-custom/side-standing-scooter.png?v=2') },
  { id: 229, kind: 'Reformer', en: 'Teaser Beats', zh: 'V型直腿45°拍打', image: assetUrl('assets/reformer-custom/teaser-beats.png?v=1') },
]
const moreNames: { kind: EquipmentKind; en: string; zh: string }[] = [
  { kind: '塔架', en: 'Standing Arm Press', zh: '站姿手臂推压' }, { kind: '塔架', en: 'Roll Back', zh: '塔架后卷' }, { kind: '塔架', en: 'Hip Opener', zh: '髋部打开' },
  { kind: '垫上', en: 'Plank Leg Lift', zh: '平板抬腿' }, { kind: '垫上', en: 'Side Plank Twist', zh: '侧平板扭转' }, { kind: '垫上', en: 'Bridge March', zh: '桥式交替抬腿' },
  { kind: 'Ladder Barrel', en: 'Side Stretch', zh: '侧向伸展' }, { kind: 'Ladder Barrel', en: 'Back Extension', zh: '背部伸展' }, { kind: 'Ladder Barrel', en: 'Adductor Stretch', zh: '内收肌伸展' },
  { kind: '小器械', en: 'Magic Circle Arm Press', zh: '普拉提圈手臂推压' }, { kind: '小器械', en: 'Small Ball Leg Lift', zh: '小球抬腿' }, { kind: '小器械', en: 'Resistance Band Side Step', zh: '弹力带侧向行走' },
  { kind: 'Wunda Chair', en: 'Pumping One Leg', zh: '单腿踩踏' }, { kind: 'Wunda Chair', en: 'Flying Eagle', zh: '飞鹰式' }, { kind: 'Wunda Chair', en: 'Side Mountain Climb', zh: '侧向登山' },
  { kind: 'Reformer', en: 'Coordination', zh: '协调式' }, { kind: 'Reformer', en: 'Stomach Massage Basic', zh: '胃部按摩基础式' }, { kind: 'Reformer', en: 'Running', zh: '跑步式' },
]
const moreExercises: Exercise[] = moreNames.map((item, index) => ({ ...item, id: 103 + index, image: assetUrl('assets/more-exercises/more-exercises-clean.png?v=1'), sprite: assetUrl('assets/more-exercises/more-exercises-clean.png?v=1'), tileX: index % 6, tileY: Math.floor(index / 6), spriteCols: 6, spriteRows: 3 }))
const innerThighSqueezeExercises: Exercise[] = [
  { id: 221, kind: '小器械', en: 'Supine Tabletop Magic Circle Inner Thigh Squeeze', zh: '仰卧桌面腿普拉提圈内收', image: assetUrl('assets/small-apparatus/magic-circle-inner-thigh-squeeze-tabletop.png?v=3') },
]
const smallApparatusExtraExercises: Exercise[] = [
  { id: 238, kind: '小器械', en: 'Mini Ball Adductor Squeeze', zh: '小球内收夹压', image: assetUrl('assets/small-apparatus-extra/mini-ball-adductor-squeeze.png?v=2') },
  { id: 239, kind: '小器械', en: 'Resistance Band Chest Expansion', zh: '弹力带胸部扩展', image: assetUrl('assets/small-apparatus-extra/resistance-band-chest-expansion.png?v=3') },
  { id: 240, kind: '小器械', en: 'Foam Roller Dead Bug', zh: '泡沫轴死虫式', image: assetUrl('assets/small-apparatus-extra/foam-roller-dead-bug.png?v=2') },
  { id: 241, kind: '小器械', en: 'Mini Ball Hundred', zh: '小球百次呼吸', image: assetUrl('assets/small-apparatus-extra/mini-ball-hundred.png?v=3') },
]
const customMoreExercises: Exercise[] = moreExercises.map(exercise => {
  const moreOverrides: Record<string, string> = {
    'Pumping One Leg': 'assets/wunda-chair/13.png?v=1',
    'Flying Eagle': 'assets/wunda-chair/14.png?v=1',
    'Side Mountain Climb': 'assets/wunda-chair/15.png?v=1',
    'Resistance Band Side Step': 'assets/small-apparatus-extra/resistance-band-side-step.png?v=1',
  }
  if (moreOverrides[exercise.en]) return { ...exercise, image: assetUrl(moreOverrides[exercise.en]), sprite: undefined, tileX: undefined, tileY: undefined, spriteCols: undefined, spriteRows: undefined }
  if (exercise.en === 'Small Ball Leg Lift') return { ...exercise, image: assetUrl('assets/small-apparatus/small-ball-leg-lift.png?v=2'), sprite: undefined, tileX: undefined, tileY: undefined }
  if (exercise.kind === 'Reformer' && exercise.en === 'Running') return { ...exercise, image: assetUrl('assets/reformer-custom/running.png?v=1'), sprite: undefined, tileX: undefined, tileY: undefined }
  if (exercise.kind === 'Reformer' && exercise.en === 'Stomach Massage Basic') return { ...exercise, image: assetUrl('assets/reformer-custom/stomach-massage-basic.png?v=1'), sprite: undefined, tileX: undefined, tileY: undefined }
  return exercise
})
type ReformerLibraryItem = { en: string; zh: string; file: string; category: Exclude<ReformerCategory, '全部'>; muscles: MuscleGroup[] }
const reformerComprehensiveItems: ReformerLibraryItem[] = [
  { en: 'Footwork Arches', zh: '足弓脚踏', file: 'footwork-arches', category: '仰卧·脚踏与跳跃', muscles: ['股四', '臀部', '腘绳', '小腿'] },
  { en: 'Footwork Tendon Stretch', zh: '脚踏肌腱伸展', file: 'footwork-tendon-stretch', category: '仰卧·脚踏与跳跃', muscles: ['小腿', '腘绳', '股四'] },
  { en: 'Backbend', zh: '后弯式', file: 'backbend', category: '俯卧系', muscles: ['背部', '臀部', '肩部', '腹部'] },
  { en: 'Up Stretch Combo', zh: '上伸展组合', file: 'up-stretch-combo', category: '俯卧系', muscles: ['肩部', '手臂', '腹部', '腘绳'] },
  { en: 'One-Leg Tendon Stretch Front', zh: '单腿前向肌腱伸展', file: 'one-leg-tendon-stretch-front', category: '侧向与站姿', muscles: ['腘绳', '小腿', '臀部', '腹部'] },
  { en: 'Tendon Stretch Combo', zh: '肌腱伸展组合', file: 'tendon-stretch-combo', category: '俯卧系', muscles: ['肩部', '手臂', '腹部', '腘绳'] },
  { en: 'Short Box Around the World', zh: '短箱环游世界', file: 'short-box-around-the-world', category: '短箱系列', muscles: ['腹部', '背部', '髋部'] },
  { en: 'Headstand 1', zh: '头倒立一式', file: 'headstand-1', category: '倒立与高阶', muscles: ['肩部', '手臂', '腹部', '背部'] },
  { en: 'Headstand 2', zh: '头倒立二式', file: 'headstand-2', category: '倒立与高阶', muscles: ['肩部', '手臂', '腹部', '背部'] },
  { en: 'Headstand with Straps', zh: '拉带头倒立', file: 'headstand-with-straps', category: '倒立与高阶', muscles: ['肩部', '手臂', '腹部', '背部'] },
  { en: 'Swakate Series', zh: 'Swakate 手臂系列', file: 'swakate-series', category: '坐姿系', muscles: ['肩部', '手臂', '背部', '腹部'] },
  { en: 'Scorpion', zh: '蝎子式', file: 'scorpion', category: '俯卧系', muscles: ['背部', '臀部', '肩部', '腹部'] },
  { en: 'Gondola', zh: '吊桥式', file: 'gondola', category: '侧向与站姿', muscles: ['臀部', '髋部', '股四', '腹部'] },
  { en: 'Reformer Roll Down', zh: '滑床卷腹后倒', file: 'reformer-roll-down', category: '仰卧·核心与桥', muscles: ['腹部', '背部', '髋部'] },
  { en: 'Oblique Roll Down', zh: '斜向卷腹后倒', file: 'oblique-roll-down', category: '仰卧·核心与桥', muscles: ['腹部', '背部', '髋部'] },
  { en: 'Single-Leg Footwork Arches', zh: '单腿足弓脚踏', file: 'single-leg-footwork-arches', category: '仰卧·脚踏与跳跃', muscles: ['股四', '臀部', '腘绳', '小腿'] },
  { en: 'Wide-V Toes', zh: '宽位脚趾脚踏', file: 'wide-v-toes', category: '仰卧·脚踏与跳跃', muscles: ['股四', '臀部', '髋部', '小腿'] },
  { en: 'Wide-V Heels', zh: '宽位足跟脚踏', file: 'wide-v-heels', category: '仰卧·脚踏与跳跃', muscles: ['股四', '臀部', '髋部', '腘绳'] },
  { en: 'Supine Arm Press Down', zh: '仰卧手臂下压', file: 'supine-arm-press-down', category: '仰卧·手臂', muscles: ['肩部', '手臂', '背部', '腹部'] },
  { en: 'Supine Arm Circles', zh: '仰卧手臂画圈', file: 'supine-arm-circles', category: '仰卧·手臂', muscles: ['肩部', '手臂', '背部', '腹部'] },
  { en: 'Supine Triceps Press', zh: '仰卧肱三头肌推压', file: 'supine-triceps-press', category: '仰卧·手臂', muscles: ['手臂', '肩部', '腹部'] },
  { en: 'Supine T-Pull', zh: '仰卧T形拉带', file: 'supine-t-pull', category: '仰卧·手臂', muscles: ['肩部', '背部', '手臂', '腹部'] },
  { en: 'Feet in Straps Arcs', zh: '脚套弧线', file: 'feet-in-straps-arcs', category: '仰卧·脚套', muscles: ['髋部', '臀部', '腹部', '腘绳'] },
  { en: 'Feet in Straps Openings', zh: '脚套开合', file: 'feet-in-straps-openings', category: '仰卧·脚套', muscles: ['髋部', '臀部', '腹部'] },
  { en: 'Feet in Straps Walking', zh: '脚套行走', file: 'feet-in-straps-walking', category: '仰卧·脚套', muscles: ['髋部', '股四', '腘绳', '腹部'] },
  { en: 'Feet in Straps Beats', zh: '脚套拍击', file: 'feet-in-straps-beats', category: '仰卧·脚套', muscles: ['髋部', '腹部', '股四'] },
  { en: 'Single-Leg Circles in Straps', zh: '脚套单腿画圈', file: 'single-leg-circles-in-straps', category: '仰卧·脚套', muscles: ['髋部', '臀部', '腹部'] },
  { en: 'Single-Leg Frog', zh: '脚套单腿蛙式', file: 'single-leg-frog', category: '仰卧·脚套', muscles: ['髋部', '臀部', '股四', '腹部'] },
  { en: 'Long Box Swan Dive', zh: '长箱天鹅俯冲', file: 'long-box-swan-dive', category: '俯卧系', muscles: ['背部', '臀部', '肩部', '腘绳'] },
  { en: 'Long Box Triceps Pull', zh: '长箱肱三头肌拉带', file: 'long-box-triceps-pull', category: '俯卧系', muscles: ['手臂', '肩部', '背部', '腹部'] },
  { en: 'Long Box Teaser Arm Circles', zh: '长箱V形手臂画圈', file: 'long-box-teaser-arm-circles', category: '俯卧系', muscles: ['腹部', '髋部', '肩部', '手臂'] },
  { en: 'Short Box Flat Back with Pole', zh: '短箱持杆平背', file: 'short-box-flat-back-with-pole', category: '短箱系列', muscles: ['腹部', '背部', '肩部', '髋部'] },
  { en: 'Short Box Side Reach with Pole', zh: '短箱持杆侧屈', file: 'short-box-side-reach-with-pole', category: '短箱系列', muscles: ['腹部', '背部', '肩部', '髋部'] },
  { en: 'Rowing Front I: Sitting Tall', zh: '前向划船一式—挺直坐姿', file: 'rowing-front-i-sitting-tall', category: '坐姿系', muscles: ['背部', '肩部', '手臂', '腹部'] },
  { en: 'Rowing Front II: Bending Down', zh: '前向划船二式—俯身', file: 'rowing-front-ii-bending-down', category: '坐姿系', muscles: ['背部', '肩部', '手臂', '腹部'] },
  { en: 'Hug a Tree Facing Footbar', zh: '面向脚杆抱树式', file: 'hug-a-tree-facing-footbar', category: '坐姿系', muscles: ['胸部', '肩部', '手臂', '腹部'] },
  { en: 'Salute', zh: '面向脚杆敬礼式', file: 'salute', category: '坐姿系', muscles: ['肩部', '手臂', '腹部'] },
  { en: 'Twist Front – Punching', zh: '前向扭转出拳', file: 'twist-front-punching', category: '坐姿系', muscles: ['腹部', '肩部', '手臂', '背部'] },
  { en: 'Triceps Press Facing Straps', zh: '面向拉带肱三头肌推压', file: 'triceps-press-facing-straps', category: '跪姿系', muscles: ['手臂', '肩部', '腹部'] },
  { en: 'Kneeling Draw a Sword', zh: '跪姿拔剑式', file: 'kneeling-draw-a-sword', category: '跪姿系', muscles: ['肩部', '手臂', '背部', '腹部'] },
  { en: 'Kneeling Side Arm External Rotation', zh: '跪姿侧臂外旋', file: 'kneeling-side-arm-external-rotation', category: '跪姿系', muscles: ['肩部', '手臂', '背部', '腹部'] },
  { en: 'One-Leg Knee Stretch Round', zh: '单腿圆背膝部伸展', file: 'one-leg-knee-stretch-round', category: '跪姿系', muscles: ['腹部', '肩部', '臀部', '股四'] },
  { en: 'One-Leg Knee Stretch Arched', zh: '单腿拱背膝部伸展', file: 'one-leg-knee-stretch-arched', category: '跪姿系', muscles: ['背部', '肩部', '臀部', '股四'] },
  { en: 'One-Leg Long Stretch', zh: '单腿长伸展', file: 'one-leg-long-stretch', category: '俯卧系', muscles: ['肩部', '手臂', '腹部', '臀部'] },
  { en: 'Long Stretch Leg Lift', zh: '长伸展抬腿', file: 'long-stretch-leg-lift', category: '俯卧系', muscles: ['肩部', '手臂', '腹部', '臀部'] },
  { en: "Eve's Lunge", zh: '夏娃弓步', file: 'eves-lunge', category: '侧向与站姿', muscles: ['髋部', '股四', '臀部', '腘绳'] },
  { en: 'Skating', zh: '滑冰式', file: 'skating', category: '侧向与站姿', muscles: ['臀部', '髋部', '股四', '腹部'] },
  { en: 'Side Split Squat', zh: '侧劈腿深蹲', file: 'side-split-squat', category: '侧向与站姿', muscles: ['臀部', '髋部', '股四', '腘绳'] },
  { en: 'Kneeling Scooter', zh: '跪姿滑板车', file: 'kneeling-scooter', category: '跪姿系', muscles: ['臀部', '股四', '髋部', '腹部'] },
  { en: 'Jumpboard Parallel Jumps', zh: '平行腿跳跃', file: 'jumpboard-parallel-jumps', category: '仰卧·脚踏与跳跃', muscles: ['股四', '臀部', '小腿', '腹部'] },
  { en: 'Jumpboard Pilates-V', zh: '普拉提V字跳跃', file: 'jumpboard-pilates-v', category: '仰卧·脚踏与跳跃', muscles: ['股四', '臀部', '髋部', '小腿'] },
  { en: 'Jumpboard Wide-V', zh: '宽位V字跳跃', file: 'jumpboard-wide-v', category: '仰卧·脚踏与跳跃', muscles: ['股四', '臀部', '髋部', '小腿'] },
  { en: 'Side-Lying Jumpboard', zh: '侧卧跳跃', file: 'side-lying-jumpboard', category: '仰卧·脚踏与跳跃', muscles: ['臀部', '髋部', '股四', '腹部'] },
  { en: 'Jumpboard Tuck Jumps', zh: '屈膝跳跃', file: 'jumpboard-tuck-jumps', category: '仰卧·脚踏与跳跃', muscles: ['腹部', '髋部', '股四', '小腿'] },
  { en: 'Single-Leg High Bridge', zh: '单腿高桥式', file: 'single-leg-high-bridge', category: '仰卧·核心与桥', muscles: ['臀部', '腘绳', '腹部', '髋部'] },
  { en: 'Twist with Bar Up', zh: '扭转式推杆上举', file: 'twist-with-bar-up', category: '俯卧系', muscles: ['肩部', '手臂', '腹部', '背部'] },
]
const reformerComprehensiveExercises: Exercise[] = reformerComprehensiveItems.map((item, index) => ({
  id: 242 + index,
  en: item.en,
  zh: item.zh,
  image: assetUrl(`assets/reformer-comprehensive/${item.file}.png?v=1`),
  kind: 'Reformer' as const,
}))
const reformerComprehensiveMuscles = Object.fromEntries(reformerComprehensiveItems.map(item => [item.en, item.muscles])) as Record<string, MuscleGroup[]>

// 高蛙式从扩展列表里拆出来，作为独立动作紧跟在蛙式后面展示（两者是一对基础/进阶）。
// 编号用空闲段（316），图片走已对齐的 reformer/45.png。
const highFrogExercise: Exercise = { id: 316, kind: 'Reformer', en: 'High Frog', zh: '高蛙式', image: assetUrl('assets/reformer/45.png?v=1') }
// 长箱天鹅式紧跟在长箱天鹅俯冲后面展示（趴长箱的一对）。
// 编号 317，图片走已对齐的 reformer/24.png。
const swanOnLongBoxExercise: Exercise = { id: 317, kind: 'Reformer', en: 'Swan on Long Box', zh: '长箱天鹅式', image: assetUrl('assets/reformer/24.png?v=1') }
// 长箱双腿踢紧跟在腘绳肌弯曲后面展示（趴长箱练腿后侧的一对）。
const longBoxDoubleLegKickExercise: Exercise = { id: 323, kind: 'Reformer', en: 'Long Box Double Leg Kick', zh: '长箱双腿踢', image: assetUrl('assets/reformer/80.png?v=1') }
// 腿后侧深度伸展：腿后侧伸展的进阶变式（手扶小腿深拉），紧跟在腿后侧伸展后面展示。
// 编号 321，图片 ladder-barrel/16.png。
const deepHamstringExercise: Exercise = { id: 321, kind: 'Ladder Barrel', en: 'Deep Hamstring Stretch', zh: '腿后侧深度伸展', image: assetUrl('assets/ladder-barrel/16.png?v=1') }
// 髋屈肌深度伸展：双臂过顶加深版，紧跟在髋屈肌伸展后面展示。
const deepHipFlexorExercise: Exercise = { id: 322, kind: 'Ladder Barrel', en: 'Deep Hip Flexor Stretch', zh: '髋屈肌深度伸展', image: assetUrl('assets/ladder-barrel/17.png?v=1') }
// 小球夹膝卷腹：球夹双膝变体，紧跟在小球腹部卷曲后面展示。
const smallBallKneeSqueezeCurl: Exercise = { id: 324, kind: '小器械', en: 'Small Ball Knee Squeeze Curl', zh: '小球夹膝卷腹', image: assetUrl('assets/small-apparatus/13.png?v=1') }
// 脚踏家族归队：脚趾/足跟/单腿三张紧跟在脚步练习后面集中展示。
const footworkToesCard: Exercise = { id: 325, kind: 'Reformer', en: 'Footwork Toes', zh: '脚趾脚踏', image: assetUrl('assets/reformer-custom/footwork-toes.png?v=1') }
const footworkHeelsCard: Exercise = { id: 326, kind: 'Reformer', en: 'Footwork Heels', zh: '足跟脚踏', image: assetUrl('assets/reformer-custom/footwork-heels.png?v=2') }
const singleLegHeelCard: Exercise = { id: 327, kind: 'Reformer', en: 'Single Leg Heel Footwork', zh: '单腿脚跟脚踏', image: assetUrl('assets/reformer-custom/single-leg-heel-footwork.png?v=1') }
const singleLegToeCard: Exercise = { id: 328, kind: 'Reformer', en: 'Single Leg Toe Footwork', zh: '单腿前脚掌脚踏', image: assetUrl('assets/reformer-custom/single-leg-toe-footwork.png?v=1') }
const singleLegLegLiftCard: Exercise = { id: 329, kind: 'Reformer', en: 'Single Leg Footwork with Leg Lift', zh: '单腿脚踏直腿上举', image: assetUrl('assets/reformer-custom/single-leg-footwork-leg-lift.png?v=1') }
const singleLegArchCard: Exercise = { id: 330, kind: 'Reformer', en: 'Single-Leg Footwork Arches', zh: '单腿足弓脚踏', image: assetUrl('assets/reformer/124.png?v=2') }
// 长伸展挪到长背伸展旁边展示（长伸展一对）。
const longStretchCard: Exercise = { id: 332, kind: 'Reformer', en: 'Long Stretch', zh: '长伸展', image: assetUrl('assets/reformer/6.png?v=1') }
const singleLegElephantCard: Exercise = { id: 333, kind: 'Reformer', en: 'Single Leg Elephant', zh: '单腿大象式', image: assetUrl('assets/reformer/36.png?v=1') }
const footworkArchesCard: Exercise = { id: 334, kind: 'Reformer', en: 'Footwork Arches', zh: '足弓脚踏', image: assetUrl('assets/reformer/105.png?v=1') }
const footworkTendonStretchCard: Exercise = { id: 335, kind: 'Reformer', en: 'Footwork Tendon Stretch', zh: '脚踏肌腱伸展', image: assetUrl('assets/reformer/106.png?v=1') }
const footworkOnFootplateCard: Exercise = { id: 336, kind: 'Reformer', en: 'Footwork on Footplate', zh: '脚踏板脚步', image: assetUrl('assets/reformer-generated/02.png?v=1') }
const jumpingOnFootplateCard: Exercise = { id: 337, kind: 'Reformer', en: 'Jumping on Footplate', zh: '脚踏板跳跃', image: assetUrl('assets/reformer-custom/jumping-on-footplate.png?v=1') }
// 仰卧桌面腿圈内收挪到普拉提圈队列末尾（与圈系六张集中展示）。
const supineTabletopSqueeze: Exercise = { id: 221, kind: '小器械', en: 'Supine Tabletop Magic Circle Inner Thigh Squeeze', zh: '仰卧桌面腿普拉提圈内收', image: assetUrl('assets/small-apparatus/magic-circle-inner-thigh-squeeze-tabletop.png?v=3') }
// 桥类三连：桥式（基础）→ 半圆式 → 高桥式（进阶），挪到骨盆抬升后面集中展示。
// 编号 318-320，图片走已对齐的 reformer/74、46、47.png。
const bridgingExercise: Exercise = { id: 318, kind: 'Reformer', en: 'Bridging', zh: '桥式', image: assetUrl('assets/reformer/74.png?v=1') }

// 已按「垫上」实拍风格重做的配图，按动作英文名索引，编号 = 该分类内的显示序号。
// 英文名不是全局唯一的（例如 Footwork 在 Wunda Chair 和 Reformer 里都有），
// 所以覆盖表必须按分类分开，应用时也要限定 kind。
const matAlignedImages: Record<string, string> = {
  'Half Roll Back': 'assets/mat/35.png?v=1',
  'Chest Lift': 'assets/mat/36.png?v=1',
  'Single Leg Lift': 'assets/mat/37.png?v=1',
  'Toe Taps': 'assets/mat/38.png?v=1',
  'Side-Lying Leg Series': 'assets/mat/39.png?v=1',
  Clam: 'assets/mat/40.png?v=1',
  Dart: 'assets/mat/41.png?v=1',
  'Mat Mermaid': 'assets/mat/42.png?v=1',
  'Plank Leg Lift': 'assets/mat/43.png?v=1',
  'Side Plank Twist': 'assets/mat/44.png?v=1',
  'Bridge March': 'assets/mat/45.png?v=1',
}

const smallApparatusAlignedImages: Record<string, string> = {
  'Magic Circle Chest Press': 'assets/small-apparatus/1.png?v=1',
  'Magic Circle Teaser': 'assets/small-apparatus/6.png?v=2',
  'Small Ball Ab Curl': 'assets/small-apparatus/7.png?v=2',
  'Small Ball Bridge': 'assets/small-apparatus/8.png?v=2',
  'Resistance Band Row': 'assets/small-apparatus/9.png?v=1',
  'Resistance Band Leg Press': 'assets/small-apparatus/10.png?v=2',
  'Foam Roller Balance': 'assets/small-apparatus/11.png?v=2',
  'Foam Roller Arm Arcs': 'assets/small-apparatus/12.png?v=2',
  'Magic Circle Bridge Squeeze': 'assets/small-apparatus/3.png?v=1',
  'Magic Circle Overhead Press': 'assets/small-apparatus/4.png?v=1',
}

const ladderBarrelAlignedImages: Record<string, string> = {
  'Swan': 'assets/ladder-barrel/1.png?v=2',
  'Ballet Stretch': 'assets/ladder-barrel/3.png?v=2',
  'Side Sit Up': 'assets/ladder-barrel/4.png?v=2',
  'Backward Stretch': 'assets/ladder-barrel/5.png?v=2',
  'Short Box Round': 'assets/ladder-barrel/6.png?v=3',
  'Tree': 'assets/ladder-barrel/7.png?v=2',
  'Leg Circles': 'assets/ladder-barrel/9.png?v=2',
  'Hamstring Stretch': 'assets/ladder-barrel/11.png?v=4',
  'Deep Hamstring Stretch': 'assets/ladder-barrel/16.png?v=1',
  'Hip Flexor Stretch': 'assets/ladder-barrel/12.png?v=3',
  'Side Stretch': 'assets/ladder-barrel/13.png?v=1',
  'Back Extension': 'assets/ladder-barrel/14.png?v=1',
  'Adductor Stretch': 'assets/ladder-barrel/15.png?v=1',
}

const reformerAlignedImages: Record<string, string> = {
  Footwork: 'assets/reformer/1.png?v=1',
  'The Hundred': 'assets/reformer/2.png?v=1',
  Frog: 'assets/reformer/3.png?v=1',
  'Leg Circles': 'assets/reformer/4.png?v=1',
  'Short Spine': 'assets/reformer/5.png?v=1',
  'Long Stretch': 'assets/reformer/6.png?v=1',
  Elephant: 'assets/reformer/7.png?v=1',
  'Knee Stretches': 'assets/reformer/8.png?v=1',
  'Long Box Pulling Straps': 'assets/reformer/9.png?v=1',
  Backstroke: 'assets/reformer/10.png?v=1',
  Teaser: 'assets/reformer/11.png?v=1',
  Mermaid: 'assets/reformer/12.png?v=1',
  'Rowing Into the Sternum': 'assets/reformer/13.png?v=1',
  'Rowing 90 Degrees': 'assets/reformer/14.png?v=2',
  'Rowing From the Chest': 'assets/reformer/15.png?v=2',
  'Rowing From the Hips': 'assets/reformer/16.png?v=2',
  Shaving: 'assets/reformer/17.png?v=1',
  Hug: 'assets/reformer/18.png?v=1',
  'Short Box Round Back': 'assets/reformer/19.png?v=1',
  'Short Box Flat Back': 'assets/reformer/20.png?v=1',
  "Short Box Side to Side": "assets/reformer/21.png?v=3",
  "Short Box Twist and Reach": "assets/reformer/22.png?v=1",
  "Gone Fishing": "assets/reformer/23.png?v=1",
  "Swan on Long Box": "assets/reformer/24.png?v=1",
  "Breaststroke": "assets/reformer/25.png?v=1",
  "Hamstring Curls": "assets/reformer/26.png?v=1",
  "Horseback": "assets/reformer/27.png?v=1",
  "Side Sit Ups": "assets/reformer/28.png?v=1",
  "Overhead": "assets/reformer/29.png?v=1",
  "Corkscrew": "assets/reformer/30.png?v=1",
  "Tic Toc": "assets/reformer/31.png?v=1",
  "Control Balance Off": "assets/reformer/32.png?v=1",
  "Grasshopper": "assets/reformer/33.png?v=1",
  "Swimming": "assets/reformer/34.png?v=2",
  "Rocking": "assets/reformer/35.png?v=1",
  "Single Leg Elephant": "assets/reformer/36.png?v=1",
  "Arabesque": "assets/reformer/37.png?v=1",
  "Long Back Stretch": "assets/reformer/38.png?v=1",
  "Stomach Massage Round": "assets/reformer/39.png?v=1",
  "Stomach Massage Hands Back": "assets/reformer/40.png?v=1",
  "Stomach Massage Reach Up": "assets/reformer/41.png?v=1",
  "Stomach Massage Twist": "assets/reformer/42.png?v=1",
  "Tendon Stretch": "assets/reformer/43.png?v=1",
  "Tendon Stretch Side": "assets/reformer/44.png?v=1",
  "High Frog": "assets/reformer/45.png?v=1",
  "Semi Circle": "assets/reformer/46.png?v=1",
  "High Bridge": "assets/reformer/47.png?v=1",
  "Chest Expansion": "assets/reformer/48.png?v=1",
  "Backbend to Bar": "assets/reformer/49.png?v=1",
  "Arm Circles": "assets/reformer/50.png?v=1",
  "Snake": "assets/reformer/51.png?v=1",
  "Twist": "assets/reformer/52.png?v=1",
  "Knee Stretches Knees Off": "assets/reformer/53.png?v=2",
  "Footbar Plank Box Slide": "assets/reformer/54.png?v=1",
  "Footbar Reverse Plank Box Slide": "assets/reformer/55.png?v=1",
  "Star": "assets/reformer/56.png?v=1",
  "Front Splits": "assets/reformer/57.png?v=1",
  "Russian Splits": "assets/reformer/58.png?v=1",
  "Footwork Toes": "assets/reformer/59.png?v=1",
  "Footwork Heels": "assets/reformer/60.png?v=1",
  "Rowing Front": "assets/reformer/61.png?v=1",
  "Pulling Straps": "assets/reformer/62.png?v=2",
  "Horizontal T-Pull": "assets/reformer/63.png?v=1",
  "Down Stretch": "assets/reformer/64.png?v=1",
  "Up Stretch": "assets/reformer/65.png?v=1",
  "Knee Stretches Round": "assets/reformer/66.png?v=1",
  "Knee Stretches Arched": "assets/reformer/67.png?v=1",
  "Pelvic Lift": "assets/reformer/68.png?v=1",
  "Side Splits": "assets/reformer/69.png?v=1",
  "Single Leg Heel Footwork": "assets/reformer/70.png?v=1",
  "Footwork on Footplate": "assets/reformer/71.png?v=2",
  "Jumping on Footplate": "assets/reformer/72.png?v=1",
  "Supine Arm Work": "assets/reformer/73.png?v=1",
  "Bridging": "assets/reformer/74.png?v=1",
  "Feet in Straps": "assets/reformer/75.png?v=1",
  "Short Box Advanced Abdominals": "assets/reformer/78.png?v=1",
  "Short Box Climb a Tree": "assets/reformer/79.png?v=1",
  "Long Box Double Leg Kick": "assets/reformer/80.png?v=1",
  "Arm Work Facing Straps": "assets/reformer/81.png?v=1",
  "Kneeling Side Arms": "assets/reformer/82.png?v=1",
  "Lunges": "assets/reformer/83.png?v=1",
  "Side Stretch / Mermaid": "assets/reformer/84.png?v=1",
  "Cleopatra": "assets/reformer/85.png?v=1",
  "Reverse Abdominals": "assets/reformer/86.png?v=1",
  "Footbar Plank Carriage Slide": "assets/reformer/87.png?v=1",
  "Footbar Reverse Plank Carriage Slide": "assets/reformer/88.png?v=1",
  "Side Support": "assets/reformer/89.png?v=1",
  "Biceps Curl": "assets/reformer/90.png?v=1",
  "Posterior Shoulder Press": "assets/reformer/91.png?v=1",
  "Serve a Tray": "assets/reformer/92.png?v=1",
  "Scooter": "assets/reformer/93.png?v=1",
  "Single Leg Toe Footwork": "assets/reformer/94.png?v=1",
  "Single Leg Footwork with Leg Lift": "assets/reformer/95.png?v=1",
  "Seated Side Arm Pull": "assets/reformer/96.png?v=1",
  "Seated Side Arm Pull – Feet Grounded": "assets/reformer/97.png?v=1",
  "Teaser Arm Pull": "assets/reformer/98.png?v=1",
  "Side Standing Scooter": "assets/reformer/99.png?v=1",
  "Teaser Beats": "assets/reformer/101.png?v=1",
  "Coordination": "assets/reformer/102.png?v=1",
  "Stomach Massage Basic": "assets/reformer/103.png?v=1",
  "Running": "assets/reformer/104.png?v=1",
  "Footwork Arches": "assets/reformer/105.png?v=1",
  "Footwork Tendon Stretch": "assets/reformer/106.png?v=1",
  "Backbend": "assets/reformer/107.png?v=1",
  "Up Stretch Combo": "assets/reformer/108.png?v=1",
  "One-Leg Tendon Stretch Front": "assets/reformer/109.png?v=1",
  "Tendon Stretch Combo": "assets/reformer/111.png?v=1",
  "Short Box Around the World": "assets/reformer/112.png?v=1",
  "Headstand 1": "assets/reformer/113.png?v=1",
  "Headstand 2": "assets/reformer/114.png?v=1",
  "Headstand with Straps": "assets/reformer/115.png?v=1",
  "Swakate Series": "assets/reformer/116.png?v=1",
  "Scorpion": "assets/reformer/118.png?v=1",
  "Gondola": "assets/reformer/121.png?v=1",
  "Reformer Roll Down": "assets/reformer/122.png?v=1",
  "Oblique Roll Down": "assets/reformer/123.png?v=1",
  "Single-Leg Footwork Arches": "assets/reformer/124.png?v=2",
  "Wide-V Toes": "assets/reformer/126.png?v=2",
  "Wide-V Heels": "assets/reformer/127.png?v=2",
  "Supine Arm Press Down": "assets/reformer/128.png?v=1",
  "Supine Arm Circles": "assets/reformer/129.png?v=2",
  "Supine Triceps Press": "assets/reformer/130.png?v=1",
  "Supine T-Pull": "assets/reformer/131.png?v=2",
  "Feet in Straps Arcs": "assets/reformer/132.png?v=1",
  "Feet in Straps Openings": "assets/reformer/133.png?v=1",
  "Feet in Straps Walking": "assets/reformer/134.png?v=1",
  "Feet in Straps Beats": "assets/reformer/135.png?v=1",
  "Single-Leg Circles in Straps": "assets/reformer/136.png?v=1",
  "Single-Leg Frog": "assets/reformer/137.png?v=1",
  "Long Box Swan Dive": "assets/reformer/139.png?v=1",
  "Long Box Triceps Pull": "assets/reformer/140.png?v=1",
  "Long Box Teaser Arm Circles": "assets/reformer/141.png?v=v=2",
  "Short Box Flat Back with Pole": "assets/reformer/143.png?v=1",
  "Short Box Side Reach with Pole": "assets/reformer/144.png?v=1",
  "Rowing Front I: Sitting Tall": "assets/reformer/145.png?v=1",
  "Rowing Front II: Bending Down": "assets/reformer/146.png?v=1",
  "Hug a Tree Facing Footbar": "assets/reformer/147.png?v=1",
  "Salute": "assets/reformer/148.png?v=1",
  "Twist Front – Punching": "assets/reformer/149.png?v=1",
  "Triceps Press Facing Straps": "assets/reformer/150.png?v=1",
  "Kneeling Draw a Sword": "assets/reformer/152.png?v=1",
  "Kneeling Side Arm External Rotation": "assets/reformer/153.png?v=1",
  "One-Leg Knee Stretch Round": "assets/reformer/154.png?v=1",
  "One-Leg Knee Stretch Arched": "assets/reformer/155.png?v=1",
  "One-Leg Long Stretch": "assets/reformer/156.png?v=1",
  "Long Stretch Leg Lift": "assets/reformer/157.png?v=1",
  "Eve's Lunge": "assets/reformer/158.png?v=1",
  "Skating": "assets/reformer/159.png?v=1",
  "Side Split Squat": "assets/reformer/160.png?v=1",
  "Kneeling Scooter": "assets/reformer/162.png?v=1",
  "Jumpboard Parallel Jumps": "assets/reformer/163.png?v=1",
  "Jumpboard Pilates-V": "assets/reformer/164.png?v=1",
  "Jumpboard Wide-V": "assets/reformer/165.png?v=2",
  "Side-Lying Jumpboard": "assets/reformer/170.png?v=1",
  "Jumpboard Tuck Jumps": "assets/reformer/171.png?v=2",
  "Single-Leg High Bridge": "assets/reformer/173.png?v=1",
  "Twist with Bar Up": "assets/reformer/176.png?v=1",
}

const alignedImageFor = (exercise: Exercise) => {
  if (exercise.kind === '垫上') return matAlignedImages[exercise.en]
  if (exercise.kind === 'Reformer') return reformerAlignedImages[exercise.en]
  if (exercise.kind === '小器械') return smallApparatusAlignedImages[exercise.en]
  if (exercise.kind === 'Ladder Barrel') return ladderBarrelAlignedImages[exercise.en]
  return undefined
}

// 已下架：胃部按摩系列（王总 2026-09-30）
const REMOVED_REFORMER_NAMES = new Set(['Stomach Massage Round', 'Stomach Massage Hands Back', 'Stomach Massage Reach Up', 'Stomach Massage Twist', 'Stomach Massage Basic', 'Grasshopper'])
const REMOVED_THIS_SESSION = new Set<string>()
if (import.meta.env.DEV && REMOVED_THIS_SESSION.size) console.log('removed:', [...REMOVED_THIS_SESSION])

const exercises: Exercise[] = [...towerExercises.filter(exercise => exercise.en !== 'Tower').slice(0, 12), towerChestExpansionStanding, ...towerExercises.filter(exercise => exercise.en !== 'Tower').slice(12), ...towerExtraExercises.filter(exercise => exercise.en !== 'Hip Opener'), matExercises.filter(exercise => exercise.en !== 'Boomerang' && exercise.en !== 'Push Up' && exercise.en !== 'One Leg Circle')[0], matHundredTabletop, ...matExercises.filter(exercise => exercise.en !== 'Boomerang' && exercise.en !== 'Push Up' && exercise.en !== 'One Leg Circle').slice(1), ...matExtraExercises.filter(exercise => exercise.en !== 'Dart').flatMap(exercise => exercise.en === 'Single Leg Lift' ? [exercise, oneLegCircleMat] : [exercise]), ...extraExercisesWithCustomImages.filter(exercise => !(exercise.kind === '小器械' && exercise.en === 'Foam Roller Arm Arcs') && !(exercise.kind === 'Wunda Chair' && exercise.en === 'Going Up Side') && !(exercise.kind === 'Reformer' && exercise.en === 'Long Stretch')).flatMap(exercise => (exercise.en === 'Footwork' && exercise.kind === 'Reformer') ? [exercise, footworkTendonStretchCard, footworkToesCard, footworkArchesCard, footworkHeelsCard, singleLegHeelCard, singleLegToeCard, singleLegArchCard, singleLegLegLiftCard, footworkOnFootplateCard, jumpingOnFootplateCard] : (exercise.en === 'Elephant' && exercise.kind === 'Reformer') ? [exercise, singleLegElephantCard] : exercise.en === 'Frog' ? [exercise, highFrogExercise] : (exercise.en === 'Hamstring Stretch' && exercise.kind === 'Ladder Barrel') ? [exercise, deepHamstringExercise] : (exercise.en === 'Hip Flexor Stretch' && exercise.kind === 'Ladder Barrel') ? [exercise, deepHipFlexorExercise] : (exercise.en === 'Long Back Stretch' && exercise.kind === 'Reformer') ? [exercise, longStretchCard] : (exercise.en === 'Small Ball Ab Curl' && exercise.kind === '小器械') ? [exercise, smallBallKneeSqueezeCurl] : (exercise.en === 'Magic Circle Teaser' && exercise.kind === '小器械') ? [exercise, supineTabletopSqueeze] : [exercise]), ...innerThighSqueezeExercises.filter(exercise => exercise.en !== 'Supine Tabletop Magic Circle Inner Thigh Squeeze'), ...smallApparatusExtraExercises, ...reformerExpansionExercises.filter(exercise => exercise.en !== 'Footwork Toes' && exercise.en !== 'Footwork Heels' && exercise.en !== 'Footbar Reverse Plank Box Slide' && exercise.en !== 'Footbar Reverse Plank Carriage Slide' && exercise.en !== 'Russian Splits' && exercise.en !== 'Single Leg Elephant').flatMap(exercise => exercise.en === 'Hamstring Curls' ? [exercise, longBoxDoubleLegKickExercise] : [exercise]), ...reformerAdditionalExercises.filter(exercise => exercise.en !== 'Backbend to Bar' && exercise.en !== 'Single Leg Elephant' && exercise.en !== 'Footwork Toes' && exercise.en !== 'Footwork Heels' && exercise.en !== 'Lunges').flatMap(exercise => exercise.en === 'Pelvic Lift' ? [exercise, bridgingExercise] : [exercise]), ...reformerGeneratedExercises.filter(exercise => exercise.en !== 'Reverse Abdominals' && exercise.en !== 'Single Leg Heel Footwork' && exercise.en !== 'Footwork on Footplate' && exercise.en !== 'Jumping on Footplate'), ...singleLegFootworkExercises.filter(exercise => exercise.en !== 'Single Leg Toe Footwork' && exercise.en !== 'Single Leg Footwork with Leg Lift'), ...describedReformerExercises, ...customMoreExercises.filter(exercise => exercise.kind !== '塔架'), ...reformerComprehensiveExercises.filter(exercise => exercise.en !== 'Single-Leg Footwork Arches' && exercise.en !== 'Single-Leg Tendon Footwork' && exercise.en !== 'Footwork Arches' && exercise.en !== 'Footwork Tendon Stretch').flatMap(exercise => exercise.en === 'Long Box Swan Dive' ? [exercise, swanOnLongBoxExercise] : [exercise])].map(exercise => {
  // 已重做的实拍图是独立整图，替换图片并清掉雪碧图切片信息
  const aligned = alignedImageFor(exercise)
  return aligned ? { ...exercise, image: assetUrl(aligned), sprite: undefined, tileX: undefined, tileY: undefined } : exercise
}).filter(exercise => !((exercise.kind === 'Reformer' && exercise.en === 'Rowing Into the Sternum') || (exercise.kind === '垫上' && exercise.en === 'Rolling Like a Ball') || (exercise.kind === 'Wunda Chair' && exercise.en === 'Mermaid') || (exercise.kind === 'Ladder Barrel' && exercise.en === 'Tree') || (exercise.kind === '小器械' && exercise.en === 'Magic Circle Arm Press') || (exercise.kind === 'Reformer' && ['Tree / Climb-a-Tree', 'Short Box Mermaid', 'Thigh Stretch', 'Kneeling Abdominals Facing Back', 'Kneeling Abdominals Facing Front', 'Arm Work Facing Footbar', 'Rowing Back'].includes(exercise.en)))).filter(exercise => {
  // 已下架的动作（王总 2026-09-30 指示移除 Reformer 的胃部按摩系列）
  if (exercise.kind !== 'Reformer' || !REMOVED_REFORMER_NAMES.has(exercise.en)) return true
  REMOVED_THIS_SESSION.add(exercise.en)
  return false
})

const reformerCategoryNames: Record<Exclude<ReformerCategory, '全部'>, string[]> = {
  '仰卧·脚踏与跳跃': ['Footwork', 'Footwork Tendon Stretch', 'Footwork Toes', 'Footwork Arches', 'Footwork Heels', 'Single Leg Heel Footwork', 'Single Leg Toe Footwork', 'Single-Leg Footwork Arches', 'Single Leg Footwork with Leg Lift', 'Footwork on Footplate', 'Jumping on Footplate', 'Jumpboard Parallel Jumps', 'Jumpboard Pilates-V', 'Jumpboard Wide-V', 'Jumpboard Tuck Jumps'],
  '仰卧·脚套': ['Feet in Straps', 'Feet in Straps Arcs', 'Feet in Straps Openings', 'Feet in Straps Walking', 'Feet in Straps Beats', 'Single-Leg Circles in Straps', 'Single-Leg Frog'],
  '仰卧·手臂': ['Supine Arm Work', 'Supine Arm Press Down', 'Supine Arm Circles', 'Supine Triceps Press', 'Supine T-Pull', 'Coordination'],
  '仰卧·核心与桥': ['The Hundred', 'Frog', 'High Frog', 'Leg Circles', 'Short Spine', 'Teaser', 'Teaser Arm Pull', 'Teaser Beats', 'Oblique Roll Down', 'Reformer Roll Down', 'Corkscrew', 'Control Balance Off', 'Overhead', 'Pelvic Lift', 'Bridging', 'Semi Circle', 'High Bridge', 'Single-Leg High Bridge'],
  '坐姿系': ['Stomach Massage Basic', 'Stomach Massage Round', 'Stomach Massage Hands Back', 'Stomach Massage Reach Up', 'Stomach Massage Twist', 'Rowing Back', 'Rowing Front', 'Rowing 90 Degrees', 'Rowing From the Chest', 'Rowing From the Hips', 'Rowing Front I: Sitting Tall', 'Rowing Front II: Bending Down', 'Biceps Curl', 'Hug', 'Hug a Tree Facing Footbar', 'Serve a Tray', 'Salute', 'Shaving', 'Posterior Shoulder Press', 'Swakate Series', 'Cleopatra', 'Mermaid', 'Side Stretch / Mermaid', 'Seated Side Arm Pull', 'Seated Side Arm Pull – Feet Grounded', 'Twist Front – Punching'],
  '短箱系列': ['Short Box Round Back', 'Short Box Flat Back', 'Short Box Flat Back with Pole', 'Short Box Side to Side', 'Short Box Side Reach with Pole', 'Short Box Twist and Reach', 'Short Box Around the World', 'Short Box Climb a Tree', 'Short Box Mermaid', 'Short Box Advanced Abdominals', 'Tree / Climb-a-Tree', 'Gone Fishing'],
  '俯卧系': ['Long Back Stretch', 'Long Stretch', 'Long Stretch Leg Lift', 'One-Leg Long Stretch', 'Pulling Straps', 'Long Box Pulling Straps', 'Backstroke', 'Breaststroke', 'Swimming', 'Rocking', 'Grasshopper', 'Horseback', 'Swan on Long Box', 'Long Box Swan Dive', 'Long Box Teaser Arm Circles', 'Long Box Triceps Pull', 'Long Box Double Leg Kick', 'Snake', 'Twist', 'Twist with Bar Up', 'Scorpion', 'Up Stretch Combo', 'Tendon Stretch Combo', 'One-Leg Tendon Stretch Front', 'Backbend', 'Footbar Plank Box Slide', 'Footbar Plank Carriage Slide'],
  '跪姿系': ['Knee Stretches', 'Knee Stretches Round', 'Knee Stretches Arched', 'Knee Stretches Knees Off', 'One-Leg Knee Stretch Round', 'One-Leg Knee Stretch Arched', 'Kneeling Abdominals Facing Front', 'Kneeling Abdominals Facing Back', 'Up Stretch', 'Down Stretch', 'Elephant', 'Single Leg Elephant', 'Chest Expansion', 'Thigh Stretch', 'Arm Circles', 'Arm Work Facing Footbar', 'Arm Work Facing Straps', 'Kneeling Side Arms', 'Kneeling Side Arm External Rotation', 'Kneeling Draw a Sword', 'Kneeling Scooter', 'Triceps Press Facing Straps'],
  '侧向与站姿': ['Side Splits', 'Side Split Squat', 'Front Splits', 'Scooter', 'Side Standing Scooter', 'Skating', 'Side Support', 'Side Sit Ups', 'Star', 'Tendon Stretch Side', 'Tic Toc', 'Side-Lying Jumpboard'],
  '倒立与高阶': ['Headstand 1', 'Headstand 2', 'Headstand with Straps'],
}
const reformerCategoryList = Object.keys(reformerCategoryNames) as Exclude<ReformerCategory, '全部'>[]
const reformerCategoryFor = (en: string): Exclude<ReformerCategory, '全部'> => reformerCategoryList.find(category => reformerCategoryNames[category].includes(en)) || '俯卧系'

const spriteStyle = (exercise: Exercise) => {
  const cols = exercise.spriteCols || 4
  const rows = exercise.spriteRows || 3
  return { backgroundImage: `url(${exercise.sprite})`, backgroundSize: `${cols * 100}% ${rows * 100}%`, backgroundPosition: `${((exercise.tileX || 0) / Math.max(1, cols - 1)) * 100}% ${((exercise.tileY || 0) / Math.max(1, rows - 1)) * 100}%` }
}

const exerciseImageClass = (exercise: Exercise) => {
  // 已重做的实拍图统一是 1024×944 的整图，与垫上基准一致，用默认的 cover 即可。
  // 这样每推进一批，就自动脱离下面的 compact-* 兼容名单，不用手工维护。
  if (alignedImageFor(exercise)) return ''
  if (exercise.kind === '垫上' && ['Scissors', 'Bicycle'].includes(exercise.en)) return 'compact-mat-image'
  if (exercise.kind === 'Reformer' && exercise.id >= 242 && exercise.id <= 313) return 'compact-reformer-image'
  if (exercise.kind === 'Reformer' && ['Frog', 'Rowing 90 Degrees', 'Rowing From the Hips', 'Shaving', 'Short Box Round Back', 'Short Box Flat Back', 'Short Box Side to Side', 'Short Box Twist and Reach', 'Gone Fishing', 'Tree / Climb-a-Tree', 'High Frog', 'High Bridge', 'Footwork Heels', 'Footwork Toes', 'Single Leg Heel Footwork', 'Single Leg Toe Footwork', 'Single Leg Footwork with Leg Lift', 'Horizontal T-Pull', 'Seated Side Arm Pull', 'Seated Side Arm Pull – Feet Grounded', 'Teaser Arm Pull', 'Side Standing Scooter', 'Teaser Beats', 'Coordination', 'Arm Circles', 'Knee Stretches Knees Off', 'Running', 'Hamstring Curls', 'Long Box Pulling Straps', 'Backstroke', 'Breaststroke', 'Supine Arm Work', 'Semi Circle', 'Jumping on Footplate', 'Thigh Stretch', 'Down Stretch', 'Hug', 'Stomach Massage Basic', 'Stomach Massage Round', 'Stomach Massage Hands Back', 'Stomach Massage Reach Up', 'Stomach Massage Twist', 'Backbend to Bar', 'Russian Splits', 'Footbar Plank Carriage Slide', 'Footbar Reverse Plank Carriage Slide', 'Footbar Plank Box Slide', 'Footbar Reverse Plank Box Slide'].includes(exercise.en)) return 'compact-reformer-image'
  return ''
}

const muscleLabels: Record<MuscleGroup, string> = { 胸部: '胸部', 肩部: '肩部', 手臂: '手臂', 腹部: '腹部', 背部: '背部', 臀部: '臀部', 髋部: '髋部', 股四: '股四头肌', 腘绳: '腘绳肌', 小腿: '小腿' }

// Explicit exercise-by-exercise mapping. Pilates movements are full-body, so this
// list describes the main movers plus the most important stabilising regions shown
// by our simplified ten-region diagram; it is not a claim of muscle isolation.
const exerciseMuscles: Record<string, MuscleGroup[]> = {
  'Roll Down': ['腹部', '背部', '腘绳'],
  'Push Through Front': ['肩部', '背部', '腹部', '腘绳'],
  'Push Through Reverse': ['肩部', '背部', '手臂', '腹部'],
  Tower: ['腹部', '臀部', '腘绳'],
  Monkey: ['肩部', '背部', '腘绳', '小腿'],
  'Leg Springs Frogs': ['髋部', '臀部', '股四', '腹部'],
  'Leg Springs Circles': ['髋部', '臀部', '腹部'],
  'Leg Springs Walking': ['髋部', '股四', '腘绳', '腹部'],
  'Leg Spring Beats': ['髋部', '腹部', '股四'],
  'Arm Springs Supine': ['肩部', '手臂', '背部', '腹部'],
  'Arm Springs Kneeling': ['肩部', '手臂', '背部', '腹部'],
  'Chest Expansion': ['背部', '肩部', '手臂', '腹部'],
  'Chest Expansion (Standing)': ['背部', '肩部', '手臂', '腹部'],
  'Thigh Stretch': ['股四', '腹部', '臀部'],
  Cat: ['腹部', '背部', '肩部'],
  Mermaid: ['腹部', '背部', '肩部', '髋部'],
  Parakeet: ['臀部', '腘绳', '小腿', '腹部'],
  Breathing: ['腹部', '背部', '臀部', '腘绳'],
  'Teaser with Push-Through Bar': ['腹部', '髋部', '肩部'],
  'Hanging Pull Ups': ['背部', '肩部', '手臂', '腹部'],
  'Spread Eagle': ['背部', '肩部', '手臂', '腹部'],

  'The Hundred': ['腹部', '髋部', '肩部'],
  'The Hundred (Tabletop)': ['腹部', '髋部', '肩部'],
  'Roll Up': ['腹部', '背部', '腘绳'],
  'Roll Over': ['腹部', '背部', '腘绳'],
  'One Leg Circle': ['腹部', '髋部'],
  'Rolling Like a Ball': ['腹部', '背部'],
  'Single Leg Stretch': ['腹部', '髋部'],
  'Double Leg Stretch': ['腹部', '髋部', '肩部'],
  'Spine Stretch Forward': ['腹部', '背部', '腘绳'],
  'Open Leg Rocker': ['腹部', '髋部', '腘绳'],
  Corkscrew: ['腹部', '髋部'],
  Saw: ['腹部', '背部', '腘绳'],
  'Swan Dive': ['背部', '臀部', '肩部'],
  'Single Leg Kick': ['腘绳', '臀部', '背部'],
  'Double Leg Kick': ['腘绳', '臀部', '背部', '肩部'],
  'Neck Pull': ['腹部', '背部', '腘绳'],
  Scissors: ['腹部', '髋部', '腘绳'],
  Bicycle: ['腹部', '髋部', '腘绳'],
  'Shoulder Bridge': ['臀部', '腘绳', '腹部'],
  'Spine Twist': ['腹部', '背部'],
  Jackknife: ['腹部', '臀部', '腘绳'],
  'Side Kick': ['髋部', '臀部', '腹部'],
  Teaser: ['腹部', '髋部'],
  'Hip Twist': ['腹部', '髋部', '肩部'],
  Swimming: ['背部', '臀部', '腘绳', '肩部'],
  'Leg Pull Front': ['肩部', '手臂', '腹部', '臀部'],
  'Leg Pull Back': ['肩部', '手臂', '臀部', '腘绳'],
  'Side Kick Kneeling': ['髋部', '臀部', '腹部', '肩部'],
  'Side Bend': ['腹部', '肩部', '手臂'],
  Boomerang: ['腹部', '髋部', '腘绳'],
  Seal: ['腹部', '背部', '髋部'],
  Crab: ['腹部', '背部', '肩部'],
  Rocking: ['背部', '臀部', '腘绳', '肩部'],
  'Control Balance': ['腹部', '臀部', '腘绳'],
  'Push Up': ['胸部', '肩部', '手臂', '腹部'],

  Swan: ['背部', '臀部', '肩部'],
  Horseback: ['腹部', '髋部', '股四', '背部'],
  'Ballet Stretch': ['腘绳', '髋部', '背部'],
  'Side Sit Up': ['腹部', '背部', '髋部'],
  'Backward Stretch': ['背部', '腹部', '髋部', '肩部'],
  'Short Box Round': ['腹部', '背部'],
  Tree: ['腘绳', '髋部', '腹部'],
  'Leg Circles': ['髋部', '臀部', '腹部'],
  'Handstand Prep': ['肩部', '手臂', '腹部', '背部'],
  'Hamstring Stretch': ['腘绳', '小腿', '背部'],
  'Hip Flexor Stretch': ['髋部', '股四', '腹部'],
  'Deep Hip Flexor Stretch': ['髋部', '股四', '腹部'],

  'Magic Circle Chest Press': ['胸部', '肩部', '手臂'],
  'Magic Circle Inner Thigh Squeeze': ['髋部', '腹部'],
  'Supine Bent-Knee Magic Circle Inner Thigh Squeeze': ['髋部', '腹部'],
  'Supine Tabletop Magic Circle Inner Thigh Squeeze': ['髋部', '腹部'],
  'Magic Circle Bridge Squeeze': ['臀部', '腘绳', '髋部', '腹部'],
  'Magic Circle Overhead Press': ['肩部', '手臂', '背部'],
  'Magic Circle Side Leg Press': ['臀部', '髋部', '腹部'],
  'Magic Circle Teaser': ['腹部', '髋部'],
  'Small Ball Ab Curl': ['腹部'],
  'Small Ball Knee Squeeze Curl': ['腹部', '髋部'],
  'Small Ball Bridge': ['臀部', '腘绳', '腹部'],
  'Resistance Band Row': ['背部', '肩部', '手臂'],
  'Resistance Band Leg Press': ['股四', '臀部', '髋部'],
  'Foam Roller Balance': ['腹部', '髋部', '背部'],
  'Foam Roller Arm Arcs': ['肩部', '背部', '腹部'],

  Footwork: ['股四', '臀部', '腘绳', '小腿'],
  'Pull Up': ['肩部', '手臂', '腹部', '背部'],
  'Going Up Front': ['股四', '臀部', '腘绳'],
  'Going Up Side': ['臀部', '髋部', '股四'],
  'Mountain Climb': ['股四', '臀部', '小腿', '腹部'],
  'Swan Front': ['背部', '臀部', '肩部'],
  'Tendon Stretch': ['肩部', '手臂', '腹部', '腘绳'],
  Pike: ['肩部', '手臂', '腹部'],
  'Press Down': ['肩部', '手臂', '腹部', '背部'],

  Frog: ['髋部', '臀部', '腹部'],
  'Short Spine': ['腹部', '臀部', '腘绳'],
  'Long Stretch': ['肩部', '手臂', '腹部', '臀部'],
  Elephant: ['肩部', '腹部', '背部', '腘绳'],
  'Knee Stretches': ['肩部', '手臂', '腹部', '髋部'],
  'Long Box Pulling Straps': ['背部', '肩部', '手臂'],
  Backstroke: ['肩部', '手臂', '腹部', '髋部'],
  'Rowing Into the Sternum': ['背部', '肩部', '手臂', '腹部'],
  'Rowing 90 Degrees': ['背部', '肩部', '腹部'],
  'Rowing From the Chest': ['背部', '肩部', '手臂'],
  'Rowing From the Hips': ['背部', '肩部', '腹部'],
  Shaving: ['肩部', '手臂', '背部', '腹部'],
  Hug: ['胸部', '肩部', '手臂', '腹部'],
  'Short Box Round Back': ['腹部', '背部', '髋部'],
  'Short Box Flat Back': ['腹部', '背部', '髋部'],
  'Short Box Side to Side': ['腹部', '背部', '髋部'],
  'Short Box Twist and Reach': ['腹部', '背部', '肩部'],
  'Gone Fishing': ['腹部', '背部', '肩部', '髋部'],
  'Tree / Climb-a-Tree': ['腹部', '腘绳', '髋部', '背部'],
  'Swan on Long Box': ['背部', '臀部', '肩部'],
  Breaststroke: ['背部', '肩部', '臀部', '腘绳'],
  'Hamstring Curls': ['腘绳', '臀部', '腹部'],
  'Side Sit Ups': ['腹部', '髋部', '肩部'],
  Overhead: ['肩部', '手臂', '腹部', '背部'],
  'Tic Toc': ['腹部', '髋部', '肩部'],
  'Control Balance Off': ['腹部', '臀部', '腘绳', '肩部'],
  Grasshopper: ['背部', '臀部', '腘绳', '肩部'],
  'Single Leg Elephant': ['肩部', '手臂', '腹部', '腘绳'],
  Arabesque: ['臀部', '腘绳', '背部', '腹部'],
  'Long Back Stretch': ['肩部', '手臂', '腹部', '臀部'],
  'Stomach Massage Round': ['腹部', '髋部', '股四'],
  'Stomach Massage Hands Back': ['腹部', '髋部', '肩部'],
  'Stomach Massage Reach Up': ['腹部', '髋部', '肩部'],
  'Stomach Massage Twist': ['腹部', '髋部', '背部'],
  'Tendon Stretch Side': ['腘绳', '肩部', '腹部', '髋部'],
  'High Frog': ['髋部', '臀部', '腹部'],
  'Semi Circle': ['臀部', '腘绳', '髋部', '腹部'],
  'High Bridge': ['臀部', '腘绳', '肩部', '腹部'],
  'Backbend to Bar': ['背部', '肩部', '腹部', '髋部'],
  'Arm Circles': ['肩部', '手臂', '背部'],
  Snake: ['肩部', '手臂', '背部', '腹部'],
  Twist: ['腹部', '背部', '肩部'],
  'Knee Stretches Knees Off': ['肩部', '手臂', '腹部', '髋部'],
  'Footbar Plank Box Slide': ['肩部', '手臂', '腹部', '臀部'],
  'Footbar Reverse Plank Box Slide': ['肩部', '手臂', '腹部', '臀部'],
  Star: ['肩部', '手臂', '腹部', '髋部'],
  'Front Splits': ['腘绳', '髋部', '股四', '臀部'],
  'Russian Splits': ['腘绳', '髋部', '股四', '臀部'],
  'Single Leg Heel Footwork': ['股四', '臀部', '腘绳', '小腿'],
  'Single Leg Toe Footwork': ['股四', '臀部', '腘绳', '小腿'],
  'Single Leg Footwork with Leg Lift': ['股四', '臀部', '腘绳', '髋部', '小腿'],
  'Seated Side Arm Pull': ['肩部', '手臂', '背部', '腹部'],
  'Seated Side Arm Pull – Feet Grounded': ['肩部', '手臂', '背部', '腹部'],
  'Teaser Arm Pull': ['腹部', '髋部', '肩部', '手臂'],
  'Side Standing Scooter': ['臀部', '髋部', '股四', '小腿'],
  'Teaser Beats': ['腹部', '髋部', '股四'],
  'Footwork on Footplate': ['股四', '臀部', '腘绳', '小腿'],
  'Jumping on Footplate': ['股四', '臀部', '腘绳', '小腿'],
  'Supine Arm Work': ['肩部', '手臂', '背部', '腹部'],
  Bridging: ['臀部', '腘绳', '腹部'],
  'Kneeling Abdominals Facing Back': ['腹部', '背部', '肩部'],
  'Kneeling Abdominals Facing Front': ['腹部', '肩部', '手臂'],
  'Feet in Straps': ['腹部', '髋部', '腘绳'],
  'Short Box Advanced Abdominals': ['腹部', '背部', '髋部'],
  'Short Box Mermaid': ['腹部', '背部', '髋部', '肩部'],
  'Short Box Climb a Tree': ['腹部', '腘绳', '髋部', '背部'],
  'Long Box Double Leg Kick': ['背部', '臀部', '腘绳', '肩部'],
  'Arm Work Facing Straps': ['肩部', '手臂', '背部', '腹部'],
  'Arm Work Facing Footbar': ['肩部', '手臂', '胸部', '腹部'],
  'Kneeling Side Arms': ['肩部', '手臂', '腹部', '背部'],
  Lunges: ['股四', '臀部', '腘绳', '髋部'],
  'Side Stretch / Mermaid': ['腹部', '背部', '髋部', '肩部'],
  Cleopatra: ['腹部', '髋部', '肩部', '背部'],
  'Reverse Abdominals': ['腹部', '髋部', '肩部'],
  'Footbar Plank Carriage Slide': ['肩部', '手臂', '腹部', '臀部'],
  'Footbar Reverse Plank Carriage Slide': ['肩部', '手臂', '腹部', '臀部'],
  'Side Support': ['肩部', '手臂', '腹部', '髋部'],
  'Biceps Curl': ['手臂', '肩部', '腹部'],
  'Posterior Shoulder Press': ['肩部', '手臂', '背部', '腹部'],
  'Serve a Tray': ['胸部', '肩部', '手臂', '腹部'],
  Scooter: ['臀部', '腘绳', '股四', '髋部'],
  'Footwork Toes': ['股四', '臀部', '腘绳', '小腿'],
  'Footwork Heels': ['股四', '臀部', '腘绳', '小腿'],
  'Long Spine Massage': ['腹部', '臀部', '腘绳', '背部'],
  'Rowing Back': ['背部', '肩部', '手臂', '腹部'],
  'Rowing Front': ['背部', '肩部', '手臂', '腹部'],
  'Pulling Straps': ['背部', '肩部', '手臂', '臀部'],
  'Horizontal T-Pull': ['背部', '肩部', '手臂', '腹部'],
  'Down Stretch': ['肩部', '手臂', '腹部', '髋部'],
  'Up Stretch': ['肩部', '手臂', '腹部', '腘绳'],
  'Knee Stretches Round': ['肩部', '手臂', '腹部', '髋部'],
  'Knee Stretches Arched': ['肩部', '手臂', '腹部', '背部'],
  'Pelvic Lift': ['臀部', '腘绳', '腹部', '髋部'],
  'Side Splits': ['髋部', '臀部', '股四', '腘绳'],

  'Standing Arm Press': ['肩部', '手臂', '背部', '腹部'],
  'Roll Back': ['腹部', '背部'],
  'Hip Opener': ['髋部', '腘绳'],
  'Plank Leg Lift': ['肩部', '手臂', '腹部', '臀部'],
  'Side Plank Twist': ['腹部', '肩部', '手臂'],
  'Bridge March': ['臀部', '腘绳', '腹部'],
  'Side Stretch': ['腹部', '背部', '髋部'],
  'Back Extension': ['背部', '臀部'],
  'Adductor Stretch': ['髋部', '腘绳'],
  'Magic Circle Arm Press': ['胸部', '肩部', '手臂'],
  'Small Ball Leg Lift': ['腹部', '髋部'],
  'Resistance Band Side Step': ['臀部', '髋部'],
  'Pumping One Leg': ['股四', '臀部', '小腿'],
  'Flying Eagle': ['背部', '肩部', '腹部'],
  'Side Mountain Climb': ['肩部', '手臂', '腹部', '髋部'],
  Coordination: ['腹部', '髋部', '肩部'],
  'Stomach Massage Basic': ['腹部', '髋部', '股四'],
  'Half Roll Back': ['腹部', '背部'],
  'Chest Lift': ['腹部'],
  'Single Leg Lift': ['腹部', '髋部'],
  'Toe Taps': ['腹部', '髋部'],
  'Side-Lying Leg Series': ['臀部', '髋部', '腹部'],
  Clam: ['臀部', '髋部'],
  Dart: ['背部', '臀部', '肩部'],
  'Mat Mermaid': ['腹部', '背部', '髋部'],
  'Mini Ball Adductor Squeeze': ['髋部', '腹部'],
  'Resistance Band Chest Expansion': ['背部', '肩部', '手臂'],
  'Foam Roller Dead Bug': ['腹部', '髋部', '肩部'],
  'Mini Ball Hundred': ['腹部', '髋部'],
  Running: ['小腿', '股四', '腘绳'],
}

const equipmentExerciseMuscles: Record<string, MuscleGroup[]> = {
  // The mat Side Bend is a loaded side plank; the barrel version is an
  // unsupported lateral-flexion exercise with less upper-limb loading.
  'Ladder Barrel|Side Bend': ['腹部', '背部', '髋部'],
  // Chair and Reformer footwork share the lower-limb pattern, but chair work
  // demands more trunk stabilisation while the pedal is controlled vertically.
  'Wunda Chair|Footwork': ['股四', '臀部', '腘绳', '腹部'],
  'Reformer|Footwork': ['股四', '臀部', '腘绳', '小腿'],
}

const musclesFor = (exercise: Exercise): MuscleGroup[] => {
  return exercise.customMuscles || equipmentExerciseMuscles[`${exercise.kind}|${exercise.en}`] || reformerComprehensiveMuscles[exercise.en] || exerciseMuscles[exercise.en] || []
}

const allMuscleGroups = Object.keys(muscleLabels) as MuscleGroup[]

type Step = 'choose' | 'edit' | 'share'

export default function App() {
  const [step, setStep] = useState<Step>('choose')
  const [query, setQuery] = useState('')
  const [kind, setKind] = useState<'全部' | EquipmentKind>('全部')
  const [reformerCategory, setReformerCategory] = useState<ReformerCategory>('全部')
  const [selected, setSelected] = useState<number[]>([])
  const [logs, setLogs] = useState<Record<number, SetEntry[]>>({})
  const [exerciseNotes, setExerciseNotes] = useState<Record<number, string>>({})
  const [overallNote, setOverallNote] = useState('')
  // 自定义动作（「其他」分类）：名称 + 勾选的部位，存 localStorage
  type CustomItem = { id: number; name: string; muscles: MuscleGroup[] }
  const [customExercises, setCustomExercises] = useState<CustomItem[]>(() => {
    try { return JSON.parse(localStorage.getItem('pilates-custom-exercises') || '[]') } catch { return [] }
  })
  const [customDraft, setCustomDraft] = useState<{ id: number | null; name: string; muscles: MuscleGroup[] }>({ id: null, name: '', muscles: [] })
  useEffect(() => { localStorage.setItem('pilates-custom-exercises', JSON.stringify(customExercises)) }, [customExercises])
  const allExercises = useMemo(() => [...exercises, ...customExercises.map((item): Exercise => ({ id: item.id, en: item.name, zh: item.name, image: assetUrl('assets/custom-exercise.png?v=1'), kind: '其他', customMuscles: item.muscles }))], [customExercises])
  const toggleDraftMuscle = (group: MuscleGroup) => setCustomDraft(current => ({ ...current, muscles: current.muscles.includes(group) ? current.muscles.filter(item => item !== group) : [...current.muscles, group] }))
  const resetDraft = () => setCustomDraft({ id: null, name: '', muscles: [] })
  const saveCustom = () => {
    const name = customDraft.name.trim()
    if (!name || !customDraft.muscles.length) return
    if (customDraft.id) {
      setCustomExercises(list => list.map(item => item.id === customDraft.id ? { ...item, name, muscles: [...customDraft.muscles] } : item))
    } else {
      setCustomExercises(list => [...list, { id: Date.now(), name, muscles: [...customDraft.muscles] }])
    }
    resetDraft()
  }
  const startEditCustom = (id: number) => {
    const item = customExercises.find(entry => entry.id === id)
    if (!item) return
    setCustomDraft({ id: item.id, name: item.name, muscles: [...item.muscles] })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const deleteCustom = (id: number) => {
    setCustomExercises(list => list.filter(item => item.id !== id))
    setSelected(current => current.filter(item => item !== id))
    setCustomDraft(current => current.id === id ? { id: null, name: '', muscles: [] } : current)
  }
  const visible = useMemo(() => allExercises.filter(e => (kind === '全部' || e.kind === kind) && (kind !== 'Reformer' || reformerCategory === '全部' || reformerCategoryFor(e.en) === reformerCategory) && `${e.zh} ${e.en}`.toLowerCase().includes(query.toLowerCase())), [query, kind, reformerCategory, allExercises])
  const chosen = selected.map(id => allExercises.find(exercise => exercise.id === id)).filter((exercise): exercise is Exercise => Boolean(exercise))
  const toggle = (id: number) => setSelected(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id])
  const moveExercise = (id: number, direction: -1 | 1) => setSelected(current => {
    const index = current.indexOf(id)
    const nextIndex = index + direction
    if (index < 0 || nextIndex < 0 || nextIndex >= current.length) return current
    const next = [...current]
    ;[next[index], next[nextIndex]] = [next[nextIndex], next[index]]
    return next
  })
  const removeExercise = (id: number) => {
    setSelected(current => current.filter(item => item !== id))
    setLogs(current => {
      const next = { ...current }
      delete next[id]
      return next
    })
    setExerciseNotes(current => {
      const next = { ...current }
      delete next[id]
      return next
    })
  }
  const updateSet = (id: number, index: number, key: keyof SetEntry, value: string) => setLogs(current => ({ ...current, [id]: (current[id] || [{ spring: '', reps: '' }]).map((set, i) => i === index ? { ...set, [key]: value } : set) }))
  const addSet = (id: number) => setLogs(current => ({ ...current, [id]: [...(current[id] || [{ spring: '', reps: '' }]), { spring: '', reps: '' }] }))
  const makeShare = () => setStep('share')
  const download = () => {
    const node = document.getElementById('share-card')
    if (!node) return
    const activeMuscles = [...new Set(chosen.flatMap(musclesFor))]
    const totalSets = chosen.reduce((sum, exercise) => sum + (logs[exercise.id] || [{ spring: '', reps: '' }]).length, 0)
    const noteLines = chosen.reduce((sum, exercise) => sum + (exerciseNotes[exercise.id] ? Math.ceil(exerciseNotes[exercise.id].length / 38) + 1 : 0), 0) + (overallNote ? Math.ceil(overallNote.length / 38) + 2 : 0)
    const canvas = document.createElement('canvas'); canvas.width = 1200; canvas.height = Math.max(1500, 430 + chosen.length * 100 + totalSets * 44 + noteLines * 34)
    const ctx = canvas.getContext('2d'); if (!ctx) return
    const drawWrappedText = (text: string, x: number, startY: number, maxWidth: number, lineHeight: number) => {
      let line = ''; let lineY = startY
      Array.from(text).forEach(character => {
        const testLine = line + character
        if (line && ctx.measureText(testLine).width > maxWidth) { ctx.fillText(line, x, lineY); line = character; lineY += lineHeight } else line = testLine
      })
      if (line) { ctx.fillText(line, x, lineY); lineY += lineHeight }
      return lineY
    }
    ctx.fillStyle = '#f7efde'; ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#211a14'; ctx.font = 'bold 48px serif'; ctx.fillText('今日训练记录', 70, 95)
    ctx.font = '26px sans-serif'; ctx.fillStyle = '#73685b'; ctx.fillText(new Date().toLocaleDateString('zh-CN'), 72, 140)
    ctx.fillStyle = '#113a63'; ctx.font = 'bold 25px sans-serif'; ctx.fillText('主要参与肌群', 72, 205)
    let chipX = 72; let chipY = 230
    ctx.font = 'bold 21px sans-serif'
    activeMuscles.forEach(group => {
      const label = muscleLabels[group]
      const width = ctx.measureText(label).width + 34
      if (chipX + width > 1128) { chipX = 72; chipY += 48 }
      ctx.fillStyle = '#113a63'; ctx.fillRect(chipX, chipY, width, 34)
      ctx.fillStyle = '#f7efde'; ctx.fillText(label, chipX + 17, chipY + 24)
      chipX += width + 12
    })
    ctx.fillStyle = '#73685b'; ctx.font = '20px sans-serif'; ctx.fillText(`本次训练覆盖 ${activeMuscles.length} 个主要发力或稳定区域`, 72, chipY + 66)
    let y = chipY + 130
    chosen.forEach(exercise => {
      ctx.fillStyle = '#9f2f24'; ctx.font = 'bold 30px serif'; ctx.fillText(`${exercise.zh}  ${exercise.en}`, 72, y); y += 48
      ctx.fillStyle = '#211a14'; ctx.font = '24px sans-serif'
      ;(logs[exercise.id] || [{ spring: '', reps: '' }]).forEach((set, i) => { ctx.fillText(`第 ${i + 1} 组     ${set.spring || '未选择弹簧'} × ${set.reps || '—'} 次`, 90, y); y += 36 })
      if (exerciseNotes[exercise.id]) { ctx.fillStyle = '#73685b'; ctx.font = '21px sans-serif'; ctx.fillText('动作心得', 90, y + 6); y = drawWrappedText(exerciseNotes[exercise.id], 205, y + 6, 900, 31) }
      y += 35
    })
    if (overallNote) { ctx.fillStyle = '#9f2f24'; ctx.font = 'bold 28px serif'; ctx.fillText('今日总心得', 72, y); y += 42; ctx.fillStyle = '#211a14'; ctx.font = '22px sans-serif'; drawWrappedText(overallNote, 72, y, 1056, 32) }
    const link = document.createElement('a'); link.download = 'pilates-workout.png'; link.href = canvas.toDataURL('image/png'); link.click()
  }

  return <main className="fitness-app">
    <header className="fitness-header"><div><h1>普拉提 · 今日记录</h1></div><span className="date-stamp">{new Date().toLocaleDateString('zh-CN')}</span></header>
    <div className="progress"><span className={step === 'choose' ? 'active' : ''}>01 选择动作</span><i /> <span className={step === 'edit' ? 'active' : ''}>02 填写训练</span><i /> <span className={step === 'share' ? 'active' : ''}>03 生成分享图</span></div>
    {step === 'choose' && <section className="sheet"><div className="section-heading"><div><span className="eyebrow">Pilates Library · {allExercises.length} Exercises</span><h2>选择今天练习的动作</h2></div><span className="count">已选 {selected.length} / {allExercises.length}</span></div><div className="filters"><button className={kind === '全部' ? 'on' : ''} onClick={() => { setKind('全部'); setReformerCategory('全部') }}>全部 · {allExercises.length}</button>{(['塔架', '垫上', 'Ladder Barrel', '小器械', 'Wunda Chair', 'Reformer', '其他'] as EquipmentKind[]).map(item => <button key={item} className={kind === item ? 'on' : ''} onClick={() => { setKind(item); setReformerCategory('全部') }}>{item} · {allExercises.filter(exercise => exercise.kind === item).length}</button>)}</div>{kind === 'Reformer' && <div className="reformer-subfilters"><span>按器械配置筛选</span><div><button className={reformerCategory === '全部' ? 'on' : ''} onClick={() => setReformerCategory('全部')}>全部 · {allExercises.filter(exercise => exercise.kind === 'Reformer').length}</button>{reformerCategoryList.map(category => <button key={category} className={reformerCategory === category ? 'on' : ''} onClick={() => setReformerCategory(category)}>{category} · {allExercises.filter(exercise => exercise.kind === 'Reformer' && reformerCategoryFor(exercise.en) === category).length}</button>)}</div></div>}{kind === '其他' && <div className="custom-panel"><div className="custom-panel-head"><div><span className="eyebrow">Custom Exercise</span><h3>{customDraft.id ? '编辑自定义动作' : '新建自定义动作'}</h3></div>{customDraft.id && <button className="text-button" onClick={resetDraft}>取消编辑</button>}</div><input className="custom-name" placeholder="第一步：给动作起个名字，如：悬挂蹬腿" maxLength={20} value={customDraft.name} onChange={e => setCustomDraft(current => ({ ...current, name: e.target.value }))} /><div className="muscle-hint">第二步：勾选这个动作练到的身体部位（可多选）</div><div className="muscle-chips">{allMuscleGroups.map(group => <button key={group} type="button" className={customDraft.muscles.includes(group) ? 'chip on' : 'chip'} onClick={() => toggleDraftMuscle(group)}>{customDraft.muscles.includes(group) ? '✓ ' : '＋ '}{muscleLabels[group]}</button>)}</div><div className="muscle-feedback" role="status">{customDraft.muscles.length ? <><b>已勾选 {customDraft.muscles.length} 个：</b>{customDraft.muscles.map(group => muscleLabels[group]).join('、')}；<span>未勾选 {allMuscleGroups.length - customDraft.muscles.length} 个</span></> : '还没有勾选任何部位——点击上方胶囊即可勾选，可多选'}</div><div className="custom-actions"><button className="primary" type="button" disabled={!customDraft.name.trim() || !customDraft.muscles.length} onClick={saveCustom}>{customDraft.id ? '保存修改' : '保存动作'}</button>{customDraft.id && <button className="secondary" type="button" onClick={resetDraft}>放弃</button>}</div><p className="custom-hint">{customExercises.length ? '点击卡片可勾选进今日训练；卡片上的「编辑」可改名或调整部位。' : '还没有自定义动作：填好名称、勾选练到的部位后保存，它会出现在下方并可以勾选进今日训练。'}</p></div>}<input className="search" placeholder="搜索动作，例如：美人鱼、蛙式、Frog" value={query} onChange={e => setQuery(e.target.value)} /><div className="exercise-grid">{visible.map(exercise => <button className={`exercise-card ${selected.includes(exercise.id) ? 'selected' : ''}`} key={exercise.id} onClick={() => toggle(exercise.id)}>{exercise.sprite ? <div className="exercise-art" role="img" aria-label={exercise.en} style={spriteStyle(exercise)} /> : <div className="exercise-image-frame"><img className={exerciseImageClass(exercise)} src={exercise.image} alt={exercise.en} /></div>}<span className="kind-mark">{exercise.kind}</span>{selected.includes(exercise.id) && <span className="chosen-mark">✓ 已选</span>}{exercise.kind === '其他' && <span className="card-tools"><span role="button" tabIndex={0} className="card-tool" onClick={e => { e.stopPropagation(); startEditCustom(exercise.id) }}>编辑</span><span role="button" tabIndex={0} className="card-tool danger" onClick={e => { e.stopPropagation(); deleteCustom(exercise.id) }}>删除</span></span>}<strong>{exercise.zh}</strong><small>{exercise.en}</small></button>)}</div><div className="action-bar"><span>先选择动作，确认后再填写弹簧、次数与训练心得</span><button className="primary" disabled={!selected.length} onClick={() => setStep('edit')}>确认选择 · {selected.length} 个动作</button></div></section>}
    {step === 'edit' && <section className="sheet edit-sheet">
      <div className="section-heading"><div><span className="eyebrow">Training Log</span><h2>填写今天的训练</h2></div><button className="text-button" onClick={() => setStep('choose')}>← 返回选动作</button></div>
      <div className="edit-layout"><div className="edit-list">
        {chosen.map((exercise, exerciseIndex) => <article className="edit-row" key={exercise.id}>
          {exercise.sprite ? <div className="edit-sprite" role="img" aria-label={exercise.en} style={spriteStyle(exercise)} /> : <div className="edit-image-frame"><img className={exerciseImageClass(exercise)} src={exercise.image} alt="" /></div>}
          <div className="edit-main">
            <div className="edit-row-heading"><div className="edit-title"><h3>{exercise.zh}</h3><small>{exercise.en}</small></div><div className="edit-row-actions"><div className="order-actions" aria-label={`调整动作顺序：${exercise.zh}`}><button type="button" disabled={exerciseIndex === 0} aria-label={`上移：${exercise.zh}`} onClick={() => moveExercise(exercise.id, -1)}>↑ 上移</button><button type="button" disabled={exerciseIndex === chosen.length - 1} aria-label={`下移：${exercise.zh}`} onClick={() => moveExercise(exercise.id, 1)}>↓ 下移</button></div><button className="remove-exercise" type="button" aria-label={`删除动作：${exercise.zh} ${exercise.en}`} onClick={() => removeExercise(exercise.id)}>删除动作</button></div></div>
            {(logs[exercise.id] || [{ spring: '', reps: '' }]).map((set, index) => <div className="set-line" key={index}>
              <span>第 {index + 1} 组</span>
              <select aria-label={`${exercise.zh}第${index + 1}组弹簧`} value={set.spring} onChange={e => updateSet(exercise.id, index, 'spring', e.target.value)}><option value="">选择弹簧</option>{springOptions.map((spring, springIndex) => <option value={spring} key={spring}>{['🔴', '🟢', '🟡', '⚪'][springIndex]} {spring}</option>)}</select>
              <b>×</b><input inputMode="numeric" placeholder="次数" value={set.reps} onChange={e => updateSet(exercise.id, index, 'reps', e.target.value)} /><b>次</b>
            </div>)}
            <button className="add-set" onClick={() => addSet(exercise.id)}>＋ 添加一组</button>
            <label className="note-field"><span>动作心得</span><textarea rows={3} maxLength={300} placeholder="记录动作感受、身体反馈或下次要调整的地方……" value={exerciseNotes[exercise.id] || ''} onChange={e => setExerciseNotes(current => ({ ...current, [exercise.id]: e.target.value }))} /></label>
          </div>
        </article>)}
        {!chosen.length && <div className="empty-training"><span className="eyebrow">No Exercise Selected</span><h3>还没有训练动作</h3><p>返回动作库重新选择，已删除动作的训练数据不会保留。</p><button className="secondary" type="button" onClick={() => setStep('choose')}>返回选择动作</button></div>}
        {chosen.length > 0 && <section className="overall-note-card"><span className="eyebrow">Session Reflection</span><label className="note-field"><span>今日总心得</span><textarea rows={5} maxLength={600} placeholder="记录今天整体的身体状态、训练收获和下次计划……" value={overallNote} onChange={e => setOverallNote(e.target.value)} /></label></section>}
      </div><MuscleMap chosen={chosen} /></div>
      <div className="action-bar"><span>{chosen.length ? `${chosen.length} 个动作 · 可用上移/下移调整训练顺序` : '请至少选择 1 个动作'}</span><button className="primary" disabled={!chosen.length} onClick={makeShare}>确认训练 · 生成分享图</button></div>
    </section>}
    {step === 'share' && <section className="sheet share-sheet">
      <div className="section-heading"><div><span className="eyebrow">Record Complete</span><h2>今日训练已整理</h2></div><button className="text-button" onClick={() => setStep('edit')}>← 修改训练</button></div>
      <div className="share-layout"><div id="share-card" className="share-preview">
        <div className="share-preview-head"><span>训练本纪 · 今日</span></div>
        {chosen.map(exercise => <article key={exercise.id}>
          <div><h3>{exercise.zh}</h3><small>{exercise.en}</small></div>
          <div>{(logs[exercise.id] || [{ spring: '', reps: '' }]).map((set, index) => <p key={index}>第 {index + 1} 组　<strong>{set.spring || '未选择弹簧'} × {set.reps || '—'} 次</strong></p>)}</div>
          {exerciseNotes[exercise.id] && <p className="share-exercise-note"><b>动作心得</b>{exerciseNotes[exercise.id]}</p>}
        </article>)}
        {overallNote && <section className="share-overall-note"><span className="eyebrow">Session Reflection</span><h3>今日总心得</h3><p>{overallNote}</p></section>}
        <footer>Keep moving · Pilates practice</footer>
      </div><MuscleMap chosen={chosen} /></div>
      <div className="share-actions"><button className="secondary" onClick={() => setStep('choose')}>重新选择</button><button className="primary" onClick={download}>下载分享图 PNG</button></div>
    </section>}
  </main>
}

const muscleMarks: Record<MuscleGroup, { cx: number; cy: number; rx: number; ry: number }[]> = {
  胸部: [{ cx: 450, cy: 285, rx: 84, ry: 52 }],
  肩部: [{ cx: 365, cy: 270, rx: 27, ry: 32 }, { cx: 535, cy: 270, rx: 27, ry: 32 }, { cx: 918, cy: 270, rx: 28, ry: 33 }, { cx: 1082, cy: 270, rx: 28, ry: 33 }],
  手臂: [{ cx: 345, cy: 370, rx: 24, ry: 78 }, { cx: 555, cy: 370, rx: 24, ry: 78 }, { cx: 895, cy: 370, rx: 24, ry: 78 }, { cx: 1105, cy: 370, rx: 24, ry: 78 }],
  腹部: [{ cx: 450, cy: 390, rx: 68, ry: 100 }],
  背部: [{ cx: 1000, cy: 335, rx: 102, ry: 120 }, { cx: 1000, cy: 435, rx: 66, ry: 70 }],
  臀部: [{ cx: 955, cy: 520, rx: 53, ry: 52 }, { cx: 1045, cy: 520, rx: 53, ry: 52 }],
  髋部: [{ cx: 410, cy: 520, rx: 46, ry: 55 }, { cx: 490, cy: 520, rx: 46, ry: 55 }],
  股四: [{ cx: 405, cy: 645, rx: 39, ry: 115 }, { cx: 495, cy: 645, rx: 39, ry: 115 }],
  腘绳: [{ cx: 955, cy: 660, rx: 38, ry: 115 }, { cx: 1045, cy: 660, rx: 38, ry: 115 }],
  小腿: [{ cx: 407, cy: 835, rx: 27, ry: 82 }, { cx: 493, cy: 835, rx: 27, ry: 82 }, { cx: 957, cy: 835, rx: 27, ry: 82 }, { cx: 1043, cy: 835, rx: 27, ry: 82 }],
}

function MuscleMap({ chosen }: { chosen: Exercise[] }) {
  const active = [...new Set(chosen.flatMap(musclesFor))]
  return <aside className="muscle-panel"><div className="muscle-panel-head"><div><span className="eyebrow">Muscle Focus</span><h3>主要参与肌群</h3></div><span>{active.length} 个区域</span></div><div className="muscle-figure"><img src={assetUrl('assets/muscle-map-generated.png?v=2')} alt="女性前后肌肉示意图" /><svg viewBox="0 0 1448 1086" aria-hidden="true">{active.flatMap(group => muscleMarks[group].map((mark, index) => <ellipse key={`${group}-${index}`} {...mark} className="muscle-highlight" />))}</svg></div><div className="muscle-legend">{(Object.keys(muscleLabels) as MuscleGroup[]).map(group => <span className={active.includes(group) ? 'active' : ''} key={group}><i />{muscleLabels[group]}</span>)}</div><p>深蓝色表示主要发力肌群及维持动作所需的关键稳定肌群；伸展动作显示主要被拉伸区域。</p></aside>
}
