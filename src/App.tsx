import { useMemo, useState } from 'react'
import './App.css'

type EquipmentKind = '塔架' | '垫上' | 'Ladder Barrel' | '小器械' | 'Wunda Chair' | 'Reformer'
type MuscleGroup = '胸部' | '肩部' | '手臂' | '腹部' | '背部' | '臀部' | '髋部' | '股四' | '腘绳' | '小腿'
type Exercise = { id: number; en: string; zh: string; image: string; kind: EquipmentKind; sprite?: string; tileX?: number; tileY?: number }
type SetEntry = { weight: string; reps: string }
const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`

const towerExercises: Exercise[] = [
  ['Roll Down', '卷腹下拉'], ['Push Through Front', '推杆前推'], ['Push Through Reverse', '推杆反向'], ['Tower', '塔式'], ['Monkey', '猴式'],
  ['Leg Springs Frogs', '腿弹簧蛙式'], ['Leg Springs Circles', '腿弹簧画圈'], ['Leg Springs Walking', '腿弹簧行走'], ['Leg Spring Beats', '腿弹簧拍击'], ['Arm Springs Supine', '仰卧手臂弹簧'],
  ['Arm Springs Kneeling', '跪姿手臂弹簧'], ['Chest Expansion', '胸部扩展'], ['Thigh Stretch', '大腿伸展'], ['Cat', '猫式'], ['Mermaid', '美人鱼式'],
  ['Parakeet', '鹦鹉式'], ['Breathing', '呼吸式'], ['Teaser with Push-Through Bar', '推杆V形平衡'], ['Hanging Pull Ups', '悬垂引体'], ['Spread Eagle', '展翅式'],
].map((item, index) => ({ id: index + 1, en: item[0], zh: item[1], image: assetUrl(`assets/exercises/${index + 1}.png?v=2`), kind: '塔架' as const }))

const matNames: [string, string][] = [
  ['The Hundred', '百次呼吸'], ['Roll Up', '卷脊起身'], ['Roll Over', '翻滚'], ['One Leg Circle', '单腿画圈'], ['Rolling Like a Ball', '像球一样滚动'], ['Single Leg Stretch', '单腿伸展'], ['Double Leg Stretch', '双腿伸展'], ['Spine Stretch Forward', '脊柱前伸展'], ['Open Leg Rocker', '开腿摇摆'], ['Corkscrew', '螺旋转'], ['Saw', '锯式'], ['Swan Dive', '天鹅俯冲'], ['Single Leg Kick', '单腿踢'], ['Double Leg Kick', '双腿踢'], ['Neck Pull', '颈部牵拉'], ['Scissors', '剪刀式'], ['Bicycle', '自行车式'], ['Shoulder Bridge', '肩桥'], ['Spine Twist', '脊柱扭转'], ['Jackknife', '折刀式'], ['Side Kick', '侧踢系列'], ['Teaser', 'V形平衡'], ['Hip Twist', '髋部扭转'], ['Swimming', '游泳式'], ['Leg Pull Front', '前侧腿拉'], ['Leg Pull Back', '后侧腿拉'], ['Side Kick Kneeling', '跪姿侧踢'], ['Side Bend', '侧弯支撑'], ['Boomerang', '回旋木马'], ['Seal', '海豹式'], ['Crab', '螃蟹式'], ['Rocking', '摇摆式'], ['Control Balance', '控制平衡'], ['Push Up', '普拉提俯卧撑'],
]
const matExercises: Exercise[] = matNames.map(([en, zh], index) => ({ id: 21 + index, en, zh, image: assetUrl(`assets/mat/${index + 1}.png?v=2`), kind: '垫上' as const }))
const extraSets: { kind: EquipmentKind; folder: string; names: [string, string][] }[] = [
  { kind: 'Ladder Barrel', folder: 'ladder-barrel', names: [['Swan', '天鹅式'], ['Horseback', '马背式'], ['Ballet Stretch', '芭蕾伸展'], ['Side Sit Up', '侧坐起身'], ['Backward Stretch', '后弯伸展'], ['Short Box Round', '短箱圆背'], ['Tree', '树式'], ['Side Bend', '侧弯'], ['Leg Circles', '腿部画圈'], ['Handstand Prep', '倒立准备'], ['Hamstring Stretch', '腿后侧伸展'], ['Hip Flexor Stretch', '髋屈肌伸展']] },
  { kind: '小器械', folder: 'small-apparatus', names: [['Magic Circle Chest Press', '普拉提圈胸推'], ['Magic Circle Inner Thigh Squeeze', '普拉提圈内收'], ['Magic Circle Bridge Squeeze', '普拉提圈桥式'], ['Magic Circle Overhead Press', '普拉提圈过顶推'], ['Magic Circle Side Leg Press', '普拉提圈侧腿推'], ['Magic Circle Teaser', '普拉提圈V形平衡'], ['Small Ball Ab Curl', '小球腹部卷曲'], ['Small Ball Bridge', '小球桥式'], ['Resistance Band Row', '弹力带划船'], ['Resistance Band Leg Press', '弹力带腿推'], ['Foam Roller Balance', '泡沫轴平衡'], ['Foam Roller Arm Arcs', '泡沫轴手臂画圈']] },
  { kind: 'Wunda Chair', folder: 'wunda-chair', names: [['Footwork', '脚步练习'], ['Pull Up', '上拉'], ['Going Up Front', '前侧上台'], ['Going Up Side', '侧向上台'], ['Mountain Climb', '登山式'], ['Swan Front', '前侧天鹅'], ['Mermaid', '美人鱼式'], ['Teaser', 'V形平衡'], ['Tendon Stretch', '肌腱伸展'], ['Pike', '折叠支撑'], ['Press Down', '下压'], ['Hamstring Stretch', '腿后侧伸展']] },
  { kind: 'Reformer', folder: 'reformer', names: [['Footwork', '脚步练习'], ['The Hundred', '百次呼吸'], ['Frog', '蛙式'], ['Leg Circles', '腿部画圈'], ['Short Spine', '短脊柱'], ['Long Stretch', '长伸展'], ['Elephant', '大象式'], ['Knee Stretches', '跪姿伸展'], ['Long Box Pulling Straps', '长箱拉绳'], ['Backstroke', '仰卧划水'], ['Teaser', 'V形平衡'], ['Mermaid', '美人鱼式']] },
]
const extraExercises: Exercise[] = extraSets.flatMap(({ kind, folder, names }, setIndex) => names.map(([en, zh], index) => ({ id: 55 + setIndex * 12 + index, en, zh, image: assetUrl(`assets/${folder}/${index + 1}.png?v=1`), sprite: assetUrl(`assets/${folder}/${folder}-clean.png?v=1`), tileX: index % 4, tileY: Math.floor(index / 4), kind })))
const exercises: Exercise[] = [...towerExercises, ...matExercises, ...extraExercises]

const muscleLabels: Record<MuscleGroup, string> = { 胸部: '胸部', 肩部: '肩部', 手臂: '手臂', 腹部: '腹部', 背部: '背部', 臀部: '臀部', 髋部: '髋部', 股四: '股四头肌', 腘绳: '腘绳肌', 小腿: '小腿' }
const musclesFor = (exercise: Exercise): MuscleGroup[] => {
  const name = `${exercise.en} ${exercise.zh}`.toLowerCase()
  const muscles = new Set<MuscleGroup>()
  if (/hundred|roll|teaser|corkscrew|rocker|jackknife|bicycle|crab|v形|卷|翻滚|腹|折刀|摇摆/.test(name)) muscles.add('腹部')
  if (/leg|footwork|frog|kick|scissor|bicycle|side|tree|horse|ballet|hamstring|hip flexor|knee|tendon|腿|脚|踢|剪刀|髋|侧/.test(name)) { muscles.add('股四'); muscles.add('腘绳'); muscles.add('髋部') }
  if (/bridge|swan|backstroke|pulling|row|long stretch|elephant|push|press|pull up|handstand|肩桥|天鹅|划|拉|推|上拉|倒立/.test(name)) { muscles.add('背部'); muscles.add('肩部'); muscles.add('手臂') }
  if (/circle|mermaid|hip|inner thigh|美人鱼|画圈|髋|内收/.test(name)) muscles.add('臀部')
  if (!muscles.size) { muscles.add('腹部'); muscles.add('髋部') }
  return [...muscles]
}

type Step = 'choose' | 'edit' | 'share'

export default function App() {
  const [step, setStep] = useState<Step>('choose')
  const [query, setQuery] = useState('')
  const [kind, setKind] = useState<'全部' | EquipmentKind>('全部')
  const [selected, setSelected] = useState<number[]>([])
  const [logs, setLogs] = useState<Record<number, SetEntry[]>>({})
  const visible = useMemo(() => exercises.filter(e => (kind === '全部' || e.kind === kind) && `${e.zh} ${e.en}`.toLowerCase().includes(query.toLowerCase())), [query, kind])
  const chosen = exercises.filter(e => selected.includes(e.id))
  const toggle = (id: number) => setSelected(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id])
  const updateSet = (id: number, index: number, key: keyof SetEntry, value: string) => setLogs(current => ({ ...current, [id]: (current[id] || [{ weight: '', reps: '' }]).map((set, i) => i === index ? { ...set, [key]: value } : set) }))
  const addSet = (id: number) => setLogs(current => ({ ...current, [id]: [...(current[id] || [{ weight: '', reps: '' }]), { weight: '', reps: '' }] }))
  const makeShare = () => setStep('share')
  const download = () => {
    const node = document.getElementById('share-card')
    if (!node) return
    const canvas = document.createElement('canvas'); canvas.width = 1200; canvas.height = 1500
    const ctx = canvas.getContext('2d'); if (!ctx) return
    ctx.fillStyle = '#f7efde'; ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#211a14'; ctx.font = 'bold 48px serif'; ctx.fillText('今日训练 · Cadillac / Tower', 70, 95)
    ctx.font = '26px sans-serif'; ctx.fillStyle = '#73685b'; ctx.fillText(new Date().toLocaleDateString('zh-CN'), 72, 140)
    let y = 220
    chosen.forEach(exercise => { ctx.fillStyle = '#9f2f24'; ctx.font = 'bold 30px serif'; ctx.fillText(`${exercise.zh}  ${exercise.en}`, 72, y); y += 48; ctx.fillStyle = '#211a14'; ctx.font = '24px sans-serif'; (logs[exercise.id] || []).forEach((set, i) => { ctx.fillText(`第 ${i + 1} 组     ${set.weight || '—'} kg × ${set.reps || '—'} 次`, 90, y); y += 36 }); y += 35 })
    const link = document.createElement('a'); link.download = 'pilates-workout.png'; link.href = canvas.toDataURL('image/png'); link.click()
  }

  return <main className="fitness-app">
    <header className="fitness-header"><div><span className="eyebrow">训练本纪 · 今日记录</span><h1>Cadillac / Tower</h1></div><span className="date-stamp">{new Date().toLocaleDateString('zh-CN')}</span></header>
    <div className="progress"><span className={step === 'choose' ? 'active' : ''}>01 选择动作</span><i /> <span className={step === 'edit' ? 'active' : ''}>02 填写训练</span><i /> <span className={step === 'share' ? 'active' : ''}>03 生成分享图</span></div>
    {step === 'choose' && <section className="sheet"><div className="section-heading"><div><span className="eyebrow">Classical Pilates Library · {exercises.length} Exercises</span><h2>选择今天练习的动作</h2></div><span className="count">已选 {selected.length} / {exercises.length}</span></div><div className="filters"><button className={kind === '全部' ? 'on' : ''} onClick={() => setKind('全部')}>全部 · {exercises.length}</button>{(['塔架', '垫上', 'Ladder Barrel', '小器械', 'Wunda Chair', 'Reformer'] as EquipmentKind[]).map(item => <button key={item} className={kind === item ? 'on' : ''} onClick={() => setKind(item)}>{item} · {exercises.filter(exercise => exercise.kind === item).length}</button>)}</div><input className="search" placeholder="搜索动作，例如：美人鱼、Monkey、The Hundred" value={query} onChange={e => setQuery(e.target.value)} /><div className="exercise-grid">{visible.map(exercise => <button className={`exercise-card ${selected.includes(exercise.id) ? 'selected' : ''}`} key={exercise.id} onClick={() => toggle(exercise.id)}>{exercise.sprite ? <div className="exercise-art" role="img" aria-label={exercise.en} style={{ backgroundImage: `url(${exercise.sprite})`, backgroundPosition: `${(exercise.tileX || 0) * 33.333333}% ${(exercise.tileY || 0) * 50}%` }} /> : <img src={exercise.image} alt={exercise.en} />}<span className="kind-mark">{exercise.kind}</span>{selected.includes(exercise.id) && <span className="chosen-mark">✓ 已选</span>}<strong>{exercise.zh}</strong><small>{exercise.en}</small></button>)}</div><div className="action-bar"><span>先选择动作，确认后再填写重量与组数</span><button className="primary" disabled={!selected.length} onClick={() => setStep('edit')}>确认选择 · {selected.length} 个动作</button></div></section>}
    {step === 'edit' && <section className="sheet edit-sheet"><div className="section-heading"><div><span className="eyebrow">Training Log</span><h2>填写今天的训练</h2></div><button className="text-button" onClick={() => setStep('choose')}>← 返回选动作</button></div><div className="edit-layout"><div className="edit-list">{chosen.map(exercise => <article className="edit-row" key={exercise.id}>{exercise.sprite ? <div className="edit-sprite" role="img" aria-label={exercise.en} style={{ backgroundImage: `url(${exercise.sprite})`, backgroundPosition: `${(exercise.tileX || 0) * 33.333333}% ${(exercise.tileY || 0) * 50}%` }} /> : <img src={exercise.image} alt="" />}<div className="edit-main"><div className="edit-title"><h3>{exercise.zh}</h3><small>{exercise.en}</small></div>{(logs[exercise.id] || [{ weight: '', reps: '' }]).map((set, index) => <div className="set-line" key={index}><span>第 {index + 1} 组</span><input inputMode="decimal" placeholder="重量" value={set.weight} onChange={e => updateSet(exercise.id, index, 'weight', e.target.value)} /><b>kg ×</b><input inputMode="numeric" placeholder="次数" value={set.reps} onChange={e => updateSet(exercise.id, index, 'reps', e.target.value)} /><b>次</b></div>)}<button className="add-set" onClick={() => addSet(exercise.id)}>＋ 添加一组</button></div></article>)}</div><MuscleMap chosen={chosen} /></div><div className="action-bar"><span>{chosen.length} 个动作 · 数据只保留在当前页面</span><button className="primary" onClick={makeShare}>确认训练 · 生成分享图</button></div></section>}
    {step === 'share' && <section className="sheet share-sheet"><div className="section-heading"><div><span className="eyebrow">Record Complete</span><h2>今日训练已整理</h2></div><button className="text-button" onClick={() => setStep('edit')}>← 修改训练</button></div><div className="share-layout"><div id="share-card" className="share-preview"><div className="share-preview-head"><span>训练本纪 · 今日</span><b>CADILLAC / TOWER</b></div>{chosen.map(exercise => <article key={exercise.id}><div><h3>{exercise.zh}</h3><small>{exercise.en}</small></div><div>{(logs[exercise.id] || [{ weight: '', reps: '' }]).map((set, index) => <p key={index}>第 {index + 1} 组　<strong>{set.weight || '—'} kg × {set.reps || '—'} 次</strong></p>)}</div></article>)}<footer>Keep moving · Pilates practice</footer></div><MuscleMap chosen={chosen} /></div><div className="share-actions"><button className="secondary" onClick={() => setStep('choose')}>重新选择</button><button className="primary" onClick={download}>下载分享图 PNG</button></div></section>}
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
  return <aside className="muscle-panel"><div className="muscle-panel-head"><div><span className="eyebrow">Muscle Focus</span><h3>今日训练肌群</h3></div><span>{active.length} 个区域</span></div><div className="muscle-figure"><img src={assetUrl('assets/muscle-map-generated.png?v=2')} alt="女性前后肌肉示意图" /><svg viewBox="0 0 1448 1086" aria-hidden="true">{active.flatMap(group => muscleMarks[group].map((mark, index) => <ellipse key={`${group}-${index}`} {...mark} className="muscle-highlight" />))}</svg></div><div className="muscle-legend">{(Object.keys(muscleLabels) as MuscleGroup[]).map(group => <span className={active.includes(group) ? 'active' : ''} key={group}><i />{muscleLabels[group]}</span>)}</div><p>深蓝色表示本次所选动作重点参与的肌群。</p></aside>
}
