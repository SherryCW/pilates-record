import { useMemo, useState } from 'react'
import './App.css'

type EquipmentKind = '塔架' | '垫上' | 'Ladder Barrel' | '小器械' | 'Wunda Chair' | 'Reformer'
type MuscleGroup = '胸部' | '肩部' | '手臂' | '腹部' | '背部' | '臀部' | '髋部' | '股四' | '腘绳' | '小腿'
type Exercise = { id: number; en: string; zh: string; image: string; kind: EquipmentKind; sprite?: string; tileX?: number; tileY?: number; spriteCols?: number; spriteRows?: number }
type SetEntry = { weight: string; reps: string }
const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`

const towerExercises: Exercise[] = [
  ['Roll Down', '卷腹下拉'], ['Push Through Front', '推杆前推'], ['Push Through Reverse', '推杆反向'], ['Tower', '塔式'], ['Monkey', '猴式'],
  ['Leg Springs Frogs', '腿弹簧蛙式'], ['Leg Springs Circles', '腿弹簧画圈'], ['Leg Springs Walking', '腿弹簧行走'], ['Leg Spring Beats', '腿弹簧拍击'], ['Arm Springs Supine', '仰卧手臂弹簧'],
  ['Arm Springs Kneeling', '跪姿手臂弹簧'], ['Chest Expansion', '胸部扩展'], ['Thigh Stretch', '大腿伸展'], ['Cat', '猫式'], ['Mermaid', '美人鱼式'],
  ['Parakeet', '鹦鹉式'], ['Breathing', '呼吸式'], ['Teaser with Push-Through Bar', '推杆V形平衡'], ['Hanging Pull Ups', '悬垂引体'], ['Spread Eagle', '展翅式'],
].map((item, index) => ({ id: index + 1, en: item[0], zh: item[1], image: assetUrl(`assets/exercises/${index + 1}.png?v=3`), kind: '塔架' as const }))

const matNames: [string, string][] = [
  ['The Hundred', '百次呼吸'], ['Roll Up', '卷脊起身'], ['Roll Over', '翻滚'], ['One Leg Circle', '单腿画圈'], ['Rolling Like a Ball', '像球一样滚动'], ['Single Leg Stretch', '单腿伸展'], ['Double Leg Stretch', '双腿伸展'], ['Spine Stretch Forward', '脊柱前伸展'], ['Open Leg Rocker', '开腿摇摆'], ['Corkscrew', '螺旋转'], ['Saw', '锯式'], ['Swan Dive', '天鹅俯冲'], ['Single Leg Kick', '单腿踢'], ['Double Leg Kick', '双腿踢'], ['Neck Pull', '颈部牵拉'], ['Scissors', '剪刀式'], ['Bicycle', '自行车式'], ['Shoulder Bridge', '肩桥'], ['Spine Twist', '脊柱扭转'], ['Jackknife', '折刀式'], ['Side Kick', '侧踢系列'], ['Teaser', 'V形平衡'], ['Hip Twist', '髋部扭转'], ['Swimming', '游泳式'], ['Leg Pull Front', '前侧腿拉'], ['Leg Pull Back', '后侧腿拉'], ['Side Kick Kneeling', '跪姿侧踢'], ['Side Bend', '侧弯支撑'], ['Boomerang', '回旋木马'], ['Seal', '海豹式'], ['Crab', '螃蟹式'], ['Rocking', '摇摆式'], ['Control Balance', '控制平衡'], ['Push Up', '普拉提俯卧撑'],
]
const matExercises: Exercise[] = matNames.map(([en, zh], index) => ({ id: 21 + index, en, zh, image: assetUrl(`assets/mat/${index + 1}.png?v=4`), kind: '垫上' as const }))
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
  { kind: 'Ladder Barrel', folder: 'ladder-barrel', names: [['Swan', '天鹅式'], ['Horseback', '马背式'], ['Ballet Stretch', '芭蕾伸展'], ['Side Sit Up', '侧坐起身'], ['Backward Stretch', '后弯伸展'], ['Short Box Round', '短箱圆背'], ['Tree', '树式'], ['Side Bend', '侧弯'], ['Leg Circles', '腿部画圈'], ['Handstand Prep', '倒立准备'], ['Hamstring Stretch', '腿后侧伸展'], ['Hip Flexor Stretch', '髋屈肌伸展']] },
  { kind: '小器械', folder: 'small-apparatus', names: [['Magic Circle Chest Press', '普拉提圈胸推'], ['Supine Bent-Knee Magic Circle Inner Thigh Squeeze', '仰卧屈膝普拉提圈内收'], ['Magic Circle Bridge Squeeze', '普拉提圈桥式'], ['Magic Circle Overhead Press', '普拉提圈过顶推'], ['Magic Circle Side Leg Press', '普拉提圈侧腿推'], ['Magic Circle Teaser', '普拉提圈V形平衡'], ['Small Ball Ab Curl', '小球腹部卷曲'], ['Small Ball Bridge', '小球桥式'], ['Resistance Band Row', '弹力带划船'], ['Resistance Band Leg Press', '弹力带腿推'], ['Foam Roller Balance', '泡沫轴平衡'], ['Foam Roller Arm Arcs', '泡沫轴手臂画圈']] },
  { kind: 'Wunda Chair', folder: 'wunda-chair', names: [['Footwork', '脚步练习'], ['Pull Up', '上拉'], ['Going Up Front', '前侧上台'], ['Going Up Side', '侧向上台'], ['Mountain Climb', '登山式'], ['Swan Front', '前侧天鹅'], ['Mermaid', '美人鱼式'], ['Teaser', 'V形平衡'], ['Tendon Stretch', '肌腱伸展'], ['Pike', '折叠支撑'], ['Press Down', '下压'], ['Hamstring Stretch', '腿后侧伸展']] },
  { kind: 'Reformer', folder: 'reformer', names: [['Footwork', '脚步练习'], ['The Hundred', '百次呼吸'], ['Frog', '蛙式'], ['Leg Circles', '腿部画圈'], ['Short Spine', '短脊柱'], ['Long Stretch', '长伸展'], ['Elephant', '大象式'], ['Knee Stretches', '跪姿伸展'], ['Long Box Pulling Straps', '长箱拉绳'], ['Backstroke', '仰卧划水'], ['Teaser', 'V形平衡'], ['Mermaid', '美人鱼式']] },
]
const extraExercises: Exercise[] = extraSets.flatMap(({ kind, folder, names }, setIndex) => names.map(([en, zh], index) => ({ id: 55 + setIndex * 12 + index, en, zh, image: assetUrl(`assets/${folder}/${index + 1}.png?v=1`), sprite: assetUrl(`assets/${folder}/${folder}-clean.png?v=1`), tileX: index % 4, tileY: Math.floor(index / 4), kind })))
const extraExercisesWithCustomImages: Exercise[] = extraExercises.map(exercise => {
  if (exercise.kind === 'Reformer' && exercise.en === 'The Hundred') return { ...exercise, image: assetUrl('assets/reformer/reformer-hundred.png?v=2'), sprite: undefined, tileX: undefined, tileY: undefined }
  if (exercise.kind === 'Reformer' && exercise.en === 'Frog') return { ...exercise, image: assetUrl('assets/reformer/reformer-frog.png?v=3'), sprite: undefined, tileX: undefined, tileY: undefined }
  if (exercise.kind === 'Reformer' && exercise.en === 'Long Box Pulling Straps') return { ...exercise, image: assetUrl('assets/reformer-custom/long-box-pulling-straps.png?v=1'), sprite: undefined, tileX: undefined, tileY: undefined }
  if (exercise.kind === 'Reformer' && exercise.en === 'Backstroke') return { ...exercise, image: assetUrl('assets/reformer-custom/backstroke.png?v=1'), sprite: undefined, tileX: undefined, tileY: undefined }
  if (exercise.kind === '小器械' && exercise.en === 'Supine Bent-Knee Magic Circle Inner Thigh Squeeze') return { ...exercise, image: assetUrl('assets/small-apparatus/magic-circle-inner-thigh-squeeze-supine.png?v=1'), sprite: undefined, tileX: undefined, tileY: undefined }
  if (exercise.kind === '小器械' && exercise.en === 'Magic Circle Side Leg Press') return { ...exercise, image: assetUrl('assets/small-apparatus/magic-circle-side-leg-press.png?v=1'), sprite: undefined, tileX: undefined, tileY: undefined }
  if (exercise.kind === '小器械' && exercise.en === 'Resistance Band Leg Press') return { ...exercise, image: assetUrl('assets/small-apparatus/resistance-band-leg-press.png?v=1'), sprite: undefined, tileX: undefined, tileY: undefined }
  return exercise
})
const reformerExpansionNames: [string, string][] = [
  ['Rowing Into the Sternum', '划船入胸骨'], ['Rowing 90 Degrees', '90度划船'], ['Rowing From the Chest', '胸前划船'], ['Rowing From the Hips', '髋部划船'],
  ['Shaving', '剃须式'], ['Hug', '拥抱式'], ['Short Box Round Back', '短箱圆背'], ['Short Box Flat Back', '短箱平背'],
  ['Short Box Side to Side', '短箱侧屈'], ['Short Box Twist and Reach', '短箱扭转伸展'], ['Gone Fishing', '钓鱼式（叉鱼）'], ['Tree / Climb-a-Tree', '爬树式'],
  ['Swan on Long Box', '长箱天鹅式'], ['Breaststroke', '蛙泳式'], ['Hamstring Curls', '腘绳肌弯曲'], ['Horseback', '骑马式'],
  ['Side Sit Ups', '侧仰卧起坐'], ['Overhead', '过顶式'], ['Corkscrew', '螺旋式'], ['Tic Toc', '钟摆式'],
  ['Control Balance Off', '离床控制平衡'], ['Grasshopper', '蚱蜢式'], ['Swimming', '游泳式'], ['Rocking', '摇摆式'],
  ['Single Leg Elephant', '单腿大象式'], ['Arabesque', '阿拉伯式'], ['Long Back Stretch', '长背伸展'], ['Stomach Massage Round', '胃部按摩圆背'],
  ['Stomach Massage Hands Back', '胃部按摩手后撑'], ['Stomach Massage Reach Up', '胃部按摩上伸'], ['Stomach Massage Twist', '胃部按摩扭转'], ['Tendon Stretch', '肌腱伸展'],
  ['Tendon Stretch Side', '侧向肌腱伸展'], ['High Frog', '高蛙式'], ['Semi Circle', '半圆式'], ['High Bridge', '高桥式'],
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
  'Footwork Heels': 'assets/reformer-custom/footwork-heels.png?v=1',
  'Horizontal T-Pull': 'assets/reformer-custom/horizontal-t-pull.png?v=1',
  'Down Stretch': 'assets/reformer-custom/down-stretch.png?v=1',
}
const reformerAdditionalExercises: Exercise[] = reformerAdditionalNames.map(([en, zh], index) => ({ id: 169 + index, en, zh, image: assetUrl(reformerAdditionalCustomImages[en] || `assets/reformer-additional/${String(index + 1).padStart(2, '0')}.png`), kind: 'Reformer' as const }))
const reformerGeneratedNames: [string, string][] = [
  ['Single Leg Heel Footwork', '单腿脚跟脚踏'], ['Footwork on Footplate', '脚踏板脚步'], ['Jumping on Footplate', '脚踏板跳跃'],
  ['Supine Arm Work', '仰卧手臂练习'], ['Bridging', '桥式'], ['Kneeling Abdominals Facing Back', '面向后跪姿腹部'],
  ['Kneeling Abdominals Facing Front', '面向前跪姿腹部'], ['Feet in Straps', '脚套弹簧'], ['Short Box Abdominals', '短箱腹部'],
  ['Short Box Oblique Abdominals', '短箱侧腹'], ['Short Box Advanced Abdominals', '短箱进阶腹部'], ['Short Box Mermaid', '短箱美人鱼'],
  ['Short Box Climb a Tree', '短箱爬树'], ['Long Box Double Leg Kick', '长箱双腿踢'], ['Arm Work Facing Straps', '面向弹簧手臂练习'],
  ['Arm Work Facing Footbar', '面向脚杆手臂练习'], ['Kneeling Side Arms', '跪姿侧臂'], ['Lunges', '弓步'],
  ['Side Stretch / Mermaid', '侧向伸展/美人鱼'], ['Cleopatra', '克娄巴特拉式'], ['Reverse Abdominals', '反向腹部'],
  ['Footbar Plank Carriage Slide', '脚踩脚板滑床前向移动'], ['Footbar Reverse Plank Carriage Slide', '脚踩脚板滑床后向移动'], ['Side Support', '侧支撑'],
  ['Biceps Curl', '二头肌弯举'], ['Posterior Shoulder Press', '后肩推压'], ['Serve a Tray', '端盘式'], ['Scooter', '滑板车式'],
]
const reformerGeneratedCustomImages: Record<string, string> = {
  'Single Leg Heel Footwork': 'assets/reformer-custom/single-leg-heel-footwork.png?v=1',
  'Supine Arm Work': 'assets/reformer-custom/supine-arm-work.png?v=1',
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
  { id: 227, kind: 'Reformer', en: 'Side Standing Scooter', zh: '侧向45°站姿蹬滑床', image: assetUrl('assets/reformer-custom/side-standing-scooter.png?v=1') },
  { id: 228, kind: 'Reformer', en: 'Standing Instep Press', zh: '站姿压脚背', image: assetUrl('assets/reformer-custom/standing-instep-press.png?v=1') },
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
  { id: 220, kind: '小器械', en: 'Seated Magic Circle Inner Thigh Squeeze', zh: '坐姿普拉提圈内收', image: assetUrl('assets/small-apparatus/magic-circle-inner-thigh-squeeze-seated.png?v=1') },
  { id: 221, kind: '小器械', en: 'Supine Tabletop Magic Circle Inner Thigh Squeeze', zh: '仰卧桌面腿普拉提圈内收', image: assetUrl('assets/small-apparatus/magic-circle-inner-thigh-squeeze-tabletop.png?v=1') },
]
const smallApparatusExtraExercises: Exercise[] = [
  { id: 238, kind: '小器械', en: 'Mini Ball Adductor Squeeze', zh: '小球内收夹压', image: assetUrl('assets/small-apparatus-extra/mini-ball-adductor-squeeze.png?v=1') },
  { id: 239, kind: '小器械', en: 'Resistance Band Chest Expansion', zh: '弹力带胸部扩展', image: assetUrl('assets/small-apparatus-extra/resistance-band-chest-expansion.png?v=1') },
  { id: 240, kind: '小器械', en: 'Foam Roller Dead Bug', zh: '泡沫轴死虫式', image: assetUrl('assets/small-apparatus-extra/foam-roller-dead-bug.png?v=1') },
  { id: 241, kind: '小器械', en: 'Mini Ball Hundred', zh: '小球百次呼吸', image: assetUrl('assets/small-apparatus-extra/mini-ball-hundred.png?v=1') },
]
const customMoreExercises: Exercise[] = moreExercises.map(exercise => {
  if (exercise.en === 'Small Ball Leg Lift') return { ...exercise, image: assetUrl('assets/small-apparatus/small-ball-leg-lift.png?v=1'), sprite: undefined, tileX: undefined, tileY: undefined }
  if (exercise.kind === 'Reformer' && exercise.en === 'Running') return { ...exercise, image: assetUrl('assets/reformer-custom/running.png?v=1'), sprite: undefined, tileX: undefined, tileY: undefined }
  if (exercise.kind === 'Reformer' && exercise.en === 'Stomach Massage Basic') return { ...exercise, image: assetUrl('assets/reformer-custom/stomach-massage-basic.png?v=1'), sprite: undefined, tileX: undefined, tileY: undefined }
  return exercise
})
const exercises: Exercise[] = [...towerExercises, ...matExercises, ...matExtraExercises, ...extraExercisesWithCustomImages, ...innerThighSqueezeExercises, ...smallApparatusExtraExercises, ...reformerExpansionExercises, ...reformerAdditionalExercises, ...reformerGeneratedExercises, ...singleLegFootworkExercises, ...describedReformerExercises, ...customMoreExercises].filter(exercise => !((exercise.kind === 'Wunda Chair' && exercise.en === 'Mermaid') || (exercise.kind === 'Ladder Barrel' && exercise.en === 'Tree') || (exercise.kind === '小器械' && exercise.en === 'Magic Circle Arm Press') || (exercise.kind === 'Reformer' && ['Tree / Climb-a-Tree', 'Short Box Mermaid', 'Thigh Stretch', 'Kneeling Abdominals Facing Back', 'Kneeling Abdominals Facing Front', 'Arm Work Facing Footbar', 'Rowing Back'].includes(exercise.en))))

type ReformerCategory = '全部' | '脚踏板与仰卧' | '长箱' | '短箱' | '跪姿' | '坐姿与划船' | '站姿与侧向' | '进阶与平衡'
const reformerCategoryNames: Record<Exclude<ReformerCategory, '全部'>, string[]> = {
  '脚踏板与仰卧': ['Footwork', 'The Hundred', 'Frog', 'Leg Circles', 'Short Spine', 'Footwork Toes', 'Footwork Heels', 'High Frog', 'Semi Circle', 'High Bridge', 'Pelvic Lift', 'Single Leg Heel Footwork', 'Single Leg Toe Footwork', 'Single Leg Footwork with Leg Lift', 'Footwork on Footplate', 'Jumping on Footplate', 'Supine Arm Work', 'Teaser Beats', 'Bridging', 'Feet in Straps', 'Reverse Abdominals', 'Running', 'Coordination'],
  '长箱': ['Long Box Pulling Straps', 'Backstroke', 'Swan on Long Box', 'Breaststroke', 'Hamstring Curls', 'Horseback', 'Side Sit Ups', 'Pulling Straps', 'Horizontal T-Pull', 'Grasshopper', 'Swimming', 'Long Box Double Leg Kick', 'Rocking'],
  '短箱': ['Short Box Round Back', 'Short Box Flat Back', 'Short Box Side to Side', 'Short Box Twist and Reach', 'Gone Fishing', 'Tree / Climb-a-Tree', 'Short Box Abdominals', 'Short Box Oblique Abdominals', 'Short Box Advanced Abdominals', 'Short Box Mermaid', 'Short Box Climb a Tree'],
  '跪姿': ['Knee Stretches', 'Down Stretch', 'Up Stretch', 'Knee Stretches Knees Off', 'Knee Stretches Round', 'Knee Stretches Arched', 'Chest Expansion', 'Thigh Stretch', 'Arm Circles', 'Kneeling Abdominals Facing Back', 'Kneeling Abdominals Facing Front', 'Arm Work Facing Straps', 'Arm Work Facing Footbar', 'Kneeling Side Arms'],
  '坐姿与划船': ['Rowing Into the Sternum', 'Rowing 90 Degrees', 'Rowing From the Chest', 'Rowing From the Hips', 'Rowing Back', 'Rowing Front', 'Seated Side Arm Pull', 'Seated Side Arm Pull – Feet Grounded', 'Teaser Arm Pull', 'Shaving', 'Hug', 'Teaser', 'Mermaid', 'Stomach Massage Basic', 'Stomach Massage Round', 'Stomach Massage Hands Back', 'Stomach Massage Reach Up', 'Stomach Massage Twist', 'Side Stretch / Mermaid', 'Cleopatra', 'Biceps Curl', 'Posterior Shoulder Press', 'Serve a Tray'],
  '站姿与侧向': ['Single Leg Elephant', 'Arabesque', 'Front Splits', 'Russian Splits', 'Side Splits', 'Tendon Stretch', 'Tendon Stretch Side', 'Lunges', 'Scooter', 'Side Standing Scooter', 'Standing Instep Press', 'Side Support'],
  '进阶与平衡': ['Long Stretch', 'Elephant', 'Long Back Stretch', 'Overhead', 'Corkscrew', 'Tic Toc', 'Control Balance Off', 'Snake', 'Twist', 'Footbar Plank Box Slide', 'Footbar Reverse Plank Box Slide', 'Star', 'Footbar Plank Carriage Slide', 'Footbar Reverse Plank Carriage Slide'],
}
const reformerCategoryList = Object.keys(reformerCategoryNames) as Exclude<ReformerCategory, '全部'>[]
const reformerCategoryFor = (en: string): Exclude<ReformerCategory, '全部'> => reformerCategoryList.find(category => reformerCategoryNames[category].includes(en)) || '进阶与平衡'

const spriteStyle = (exercise: Exercise) => {
  const cols = exercise.spriteCols || 4
  const rows = exercise.spriteRows || 3
  return { backgroundImage: `url(${exercise.sprite})`, backgroundSize: `${cols * 100}% ${rows * 100}%`, backgroundPosition: `${((exercise.tileX || 0) / Math.max(1, cols - 1)) * 100}% ${((exercise.tileY || 0) / Math.max(1, rows - 1)) * 100}%` }
}

const exerciseImageClass = (exercise: Exercise) => {
  if (exercise.en === 'Hanging Pull Ups') return 'hanging-pull-image'
  if (exercise.kind === '垫上' && ['Scissors', 'Bicycle'].includes(exercise.en)) return 'compact-mat-image'
  if (exercise.kind === 'Reformer' && ['Frog', 'Rowing 90 Degrees', 'Rowing From the Hips', 'Shaving', 'Short Box Round Back', 'Short Box Flat Back', 'Short Box Side to Side', 'Short Box Twist and Reach', 'Gone Fishing', 'Tree / Climb-a-Tree', 'High Frog', 'High Bridge', 'Footwork Heels', 'Footwork Toes', 'Single Leg Heel Footwork', 'Single Leg Toe Footwork', 'Single Leg Footwork with Leg Lift', 'Horizontal T-Pull', 'Seated Side Arm Pull', 'Seated Side Arm Pull – Feet Grounded', 'Teaser Arm Pull', 'Side Standing Scooter', 'Standing Instep Press', 'Teaser Beats', 'Coordination', 'Arm Circles', 'Knee Stretches Knees Off', 'Running', 'Hamstring Curls', 'Long Box Pulling Straps', 'Backstroke', 'Breaststroke', 'Supine Arm Work', 'Semi Circle', 'Jumping on Footplate', 'Thigh Stretch', 'Down Stretch', 'Hug', 'Stomach Massage Basic', 'Stomach Massage Round', 'Stomach Massage Hands Back', 'Stomach Massage Reach Up', 'Stomach Massage Twist', 'Backbend to Bar', 'Russian Splits', 'Footbar Plank Carriage Slide', 'Footbar Reverse Plank Carriage Slide', 'Footbar Plank Box Slide', 'Footbar Reverse Plank Box Slide'].includes(exercise.en)) return 'compact-reformer-image'
  if (exercise.kind === '小器械' && ['Supine Bent-Knee Magic Circle Inner Thigh Squeeze', 'Seated Magic Circle Inner Thigh Squeeze', 'Supine Tabletop Magic Circle Inner Thigh Squeeze', 'Magic Circle Side Leg Press', 'Resistance Band Leg Press', 'Small Ball Leg Lift'].includes(exercise.en)) return 'compact-small-apparatus-image'
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
  'Thigh Stretch': ['股四', '腹部', '臀部'],
  Cat: ['腹部', '背部', '肩部'],
  Mermaid: ['腹部', '背部', '肩部', '髋部'],
  Parakeet: ['臀部', '腘绳', '小腿', '腹部'],
  Breathing: ['腹部', '背部', '臀部', '腘绳'],
  'Teaser with Push-Through Bar': ['腹部', '髋部', '肩部'],
  'Hanging Pull Ups': ['背部', '肩部', '手臂', '腹部'],
  'Spread Eagle': ['背部', '肩部', '手臂', '腹部'],

  'The Hundred': ['腹部', '髋部', '肩部'],
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

  'Magic Circle Chest Press': ['胸部', '肩部', '手臂'],
  'Magic Circle Inner Thigh Squeeze': ['髋部', '腹部'],
  'Supine Bent-Knee Magic Circle Inner Thigh Squeeze': ['髋部', '腹部'],
  'Seated Magic Circle Inner Thigh Squeeze': ['髋部', '腹部'],
  'Supine Tabletop Magic Circle Inner Thigh Squeeze': ['髋部', '腹部'],
  'Magic Circle Bridge Squeeze': ['臀部', '腘绳', '髋部', '腹部'],
  'Magic Circle Overhead Press': ['肩部', '手臂', '背部'],
  'Magic Circle Side Leg Press': ['臀部', '髋部', '腹部'],
  'Magic Circle Teaser': ['腹部', '髋部'],
  'Small Ball Ab Curl': ['腹部'],
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
  'Standing Instep Press': ['小腿', '髋部', '股四'],
  'Teaser Beats': ['腹部', '髋部', '股四'],
  'Footwork on Footplate': ['股四', '臀部', '腘绳', '小腿'],
  'Jumping on Footplate': ['股四', '臀部', '腘绳', '小腿'],
  'Supine Arm Work': ['肩部', '手臂', '背部', '腹部'],
  Bridging: ['臀部', '腘绳', '腹部'],
  'Kneeling Abdominals Facing Back': ['腹部', '背部', '肩部'],
  'Kneeling Abdominals Facing Front': ['腹部', '肩部', '手臂'],
  'Feet in Straps': ['腹部', '髋部', '腘绳'],
  'Short Box Abdominals': ['腹部', '背部', '髋部'],
  'Short Box Oblique Abdominals': ['腹部', '背部', '髋部'],
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
  return equipmentExerciseMuscles[`${exercise.kind}|${exercise.en}`] || exerciseMuscles[exercise.en] || []
}

type Step = 'choose' | 'edit' | 'share'

export default function App() {
  const [step, setStep] = useState<Step>('choose')
  const [query, setQuery] = useState('')
  const [kind, setKind] = useState<'全部' | EquipmentKind>('全部')
  const [reformerCategory, setReformerCategory] = useState<ReformerCategory>('全部')
  const [selected, setSelected] = useState<number[]>([])
  const [logs, setLogs] = useState<Record<number, SetEntry[]>>({})
  const visible = useMemo(() => exercises.filter(e => (kind === '全部' || e.kind === kind) && (kind !== 'Reformer' || reformerCategory === '全部' || reformerCategoryFor(e.en) === reformerCategory) && `${e.zh} ${e.en}`.toLowerCase().includes(query.toLowerCase())), [query, kind, reformerCategory])
  const chosen = selected.map(id => exercises.find(exercise => exercise.id === id)).filter((exercise): exercise is Exercise => Boolean(exercise))
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
  }
  const updateSet = (id: number, index: number, key: keyof SetEntry, value: string) => setLogs(current => ({ ...current, [id]: (current[id] || [{ weight: '', reps: '' }]).map((set, i) => i === index ? { ...set, [key]: value } : set) }))
  const addSet = (id: number) => setLogs(current => ({ ...current, [id]: [...(current[id] || [{ weight: '', reps: '' }]), { weight: '', reps: '' }] }))
  const makeShare = () => setStep('share')
  const download = () => {
    const node = document.getElementById('share-card')
    if (!node) return
    const activeMuscles = [...new Set(chosen.flatMap(musclesFor))]
    const totalSets = chosen.reduce((sum, exercise) => sum + (logs[exercise.id] || [{ weight: '', reps: '' }]).length, 0)
    const canvas = document.createElement('canvas'); canvas.width = 1200; canvas.height = Math.max(1500, 430 + chosen.length * 100 + totalSets * 44)
    const ctx = canvas.getContext('2d'); if (!ctx) return
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
    chosen.forEach(exercise => { ctx.fillStyle = '#9f2f24'; ctx.font = 'bold 30px serif'; ctx.fillText(`${exercise.zh}  ${exercise.en}`, 72, y); y += 48; ctx.fillStyle = '#211a14'; ctx.font = '24px sans-serif'; (logs[exercise.id] || []).forEach((set, i) => { ctx.fillText(`第 ${i + 1} 组     ${set.weight || '—'} kg × ${set.reps || '—'} 次`, 90, y); y += 36 }); y += 35 })
    const link = document.createElement('a'); link.download = 'pilates-workout.png'; link.href = canvas.toDataURL('image/png'); link.click()
  }

  return <main className="fitness-app">
    <header className="fitness-header"><div><h1>训练本纪 · 今日记录</h1></div><span className="date-stamp">{new Date().toLocaleDateString('zh-CN')}</span></header>
    <div className="progress"><span className={step === 'choose' ? 'active' : ''}>01 选择动作</span><i /> <span className={step === 'edit' ? 'active' : ''}>02 填写训练</span><i /> <span className={step === 'share' ? 'active' : ''}>03 生成分享图</span></div>
    {step === 'choose' && <section className="sheet"><div className="section-heading"><div><span className="eyebrow">Classical Pilates Library · {exercises.length} Exercises</span><h2>选择今天练习的动作</h2></div><span className="count">已选 {selected.length} / {exercises.length}</span></div><div className="filters"><button className={kind === '全部' ? 'on' : ''} onClick={() => { setKind('全部'); setReformerCategory('全部') }}>全部 · {exercises.length}</button>{(['塔架', '垫上', 'Ladder Barrel', '小器械', 'Wunda Chair', 'Reformer'] as EquipmentKind[]).map(item => <button key={item} className={kind === item ? 'on' : ''} onClick={() => { setKind(item); setReformerCategory('全部') }}>{item} · {exercises.filter(exercise => exercise.kind === item).length}</button>)}</div>{kind === 'Reformer' && <div className="reformer-subfilters"><span>按器械配置筛选</span><div><button className={reformerCategory === '全部' ? 'on' : ''} onClick={() => setReformerCategory('全部')}>全部 · {exercises.filter(exercise => exercise.kind === 'Reformer').length}</button>{reformerCategoryList.map(category => <button key={category} className={reformerCategory === category ? 'on' : ''} onClick={() => setReformerCategory(category)}>{category} · {exercises.filter(exercise => exercise.kind === 'Reformer' && reformerCategoryFor(exercise.en) === category).length}</button>)}</div></div>}<input className="search" placeholder="搜索动作，例如：美人鱼、Monkey、The Hundred" value={query} onChange={e => setQuery(e.target.value)} /><div className="exercise-grid">{visible.map(exercise => <button className={`exercise-card ${selected.includes(exercise.id) ? 'selected' : ''}`} key={exercise.id} onClick={() => toggle(exercise.id)}>{exercise.sprite ? <div className="exercise-art" role="img" aria-label={exercise.en} style={spriteStyle(exercise)} /> : <div className="exercise-image-frame"><img className={exerciseImageClass(exercise)} src={exercise.image} alt={exercise.en} /></div>}<span className="kind-mark">{exercise.kind}</span>{selected.includes(exercise.id) && <span className="chosen-mark">✓ 已选</span>}<strong>{exercise.zh}</strong><small>{exercise.en}</small></button>)}</div><div className="action-bar"><span>先选择动作，确认后再填写重量与组数</span><button className="primary" disabled={!selected.length} onClick={() => setStep('edit')}>确认选择 · {selected.length} 个动作</button></div></section>}
    {step === 'edit' && <section className="sheet edit-sheet"><div className="section-heading"><div><span className="eyebrow">Training Log</span><h2>填写今天的训练</h2></div><button className="text-button" onClick={() => setStep('choose')}>← 返回选动作</button></div><div className="edit-layout"><div className="edit-list">{chosen.map((exercise, exerciseIndex) => <article className="edit-row" key={exercise.id}>{exercise.sprite ? <div className="edit-sprite" role="img" aria-label={exercise.en} style={spriteStyle(exercise)} /> : <div className="edit-image-frame"><img className={exerciseImageClass(exercise)} src={exercise.image} alt="" /></div>}<div className="edit-main"><div className="edit-row-heading"><div className="edit-title"><h3>{exercise.zh}</h3><small>{exercise.en}</small></div><div className="edit-row-actions"><div className="order-actions" aria-label={`调整动作顺序：${exercise.zh}`}><button type="button" disabled={exerciseIndex === 0} aria-label={`上移：${exercise.zh}`} onClick={() => moveExercise(exercise.id, -1)}>↑ 上移</button><button type="button" disabled={exerciseIndex === chosen.length - 1} aria-label={`下移：${exercise.zh}`} onClick={() => moveExercise(exercise.id, 1)}>↓ 下移</button></div><button className="remove-exercise" type="button" aria-label={`删除动作：${exercise.zh} ${exercise.en}`} onClick={() => removeExercise(exercise.id)}>删除动作</button></div></div>{(logs[exercise.id] || [{ weight: '', reps: '' }]).map((set, index) => <div className="set-line" key={index}><span>第 {index + 1} 组</span><input inputMode="decimal" placeholder="重量" value={set.weight} onChange={e => updateSet(exercise.id, index, 'weight', e.target.value)} /><b>kg ×</b><input inputMode="numeric" placeholder="次数" value={set.reps} onChange={e => updateSet(exercise.id, index, 'reps', e.target.value)} /><b>次</b></div>)}<button className="add-set" onClick={() => addSet(exercise.id)}>＋ 添加一组</button></div></article>)}{!chosen.length && <div className="empty-training"><span className="eyebrow">No Exercise Selected</span><h3>还没有训练动作</h3><p>返回动作库重新选择，已删除动作的训练数据不会保留。</p><button className="secondary" type="button" onClick={() => setStep('choose')}>返回选择动作</button></div>}</div><MuscleMap chosen={chosen} /></div><div className="action-bar"><span>{chosen.length ? `${chosen.length} 个动作 · 可用上移/下移调整训练顺序` : '请至少选择 1 个动作'}</span><button className="primary" disabled={!chosen.length} onClick={makeShare}>确认训练 · 生成分享图</button></div></section>}
    {step === 'share' && <section className="sheet share-sheet"><div className="section-heading"><div><span className="eyebrow">Record Complete</span><h2>今日训练已整理</h2></div><button className="text-button" onClick={() => setStep('edit')}>← 修改训练</button></div><div className="share-layout"><div id="share-card" className="share-preview"><div className="share-preview-head"><span>训练本纪 · 今日</span></div>{chosen.map(exercise => <article key={exercise.id}><div><h3>{exercise.zh}</h3><small>{exercise.en}</small></div><div>{(logs[exercise.id] || [{ weight: '', reps: '' }]).map((set, index) => <p key={index}>第 {index + 1} 组　<strong>{set.weight || '—'} kg × {set.reps || '—'} 次</strong></p>)}</div></article>)}<footer>Keep moving · Pilates practice</footer></div><MuscleMap chosen={chosen} /></div><div className="share-actions"><button className="secondary" onClick={() => setStep('choose')}>重新选择</button><button className="primary" onClick={download}>下载分享图 PNG</button></div></section>}
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
