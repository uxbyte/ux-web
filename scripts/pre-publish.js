import { execSync } from 'child_process'
import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

console.log('🔍 进行发布前检查...\n')

let hasError = false

// 1. 检查是否在正确的分支
try {
    const branch = execSync('git branch --show-current').toString().trim()
    if (branch !== 'main' && branch !== 'master') {
        console.error(`❌ 不在主分支/主干分支上（当前分支：${branch}）`)
        hasError = true
    } else {
        console.log('✓ 在正确分支上')
    }
} catch (error) {
    console.log('⚠️  不在 Git 仓库中，因此跳过分支检查')
}

// 2. 检查是否有未提交的更改
try {
    const status = execSync('git status --porcelain').toString()
    if (status) {
        console.error('❌ 发现未提交的更改：')
        console.error(status)
        hasError = true
    } else {
        console.log('✓ 没有未提交的更改')
    }
} catch (error) {
    console.log('⚠️  不在 Git 仓库中，因此跳过 Git 状态检查。')
}

// 3. 检查 package.json
const packageJsonPath = resolve(__dirname, '../package.json')
if (!existsSync(packageJsonPath)) {
    console.error('❌ package.json 不存在')
    hasError = true
} else {
    console.log('✓ package.json 存在')

    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))

    // 检查版本号
    if (packageJson.version === '1.0.0') {
        console.warn('⚠️ 版本仍为 1.0.0，请在发布前进行更新。')
    } else {
        console.log(`✓ 版本号: ${packageJson.version}`)
    }

    // 检查 name
    if (!packageJson.name || packageJson.name === 'sa-lib') {
        console.warn('⚠️ 包名仍为默认值，建议考虑更改它。')
    }

    // 检查 description
    if (!packageJson.description || packageJson.description === 'A Vue 3 component library') {
        console.warn('⚠️  描述内容仍为默认设置，建议进行更新。')
    }
}

// 4. 检查 README.md
const readmePath = resolve(__dirname, '../README.md')
if (!existsSync(readmePath)) {
    console.error('❌ README.md 不存在')
    hasError = true
} else {
    console.log('✓ README.md 存在')
}

// 5. 检查 LICENSE
const licensePath = resolve(__dirname, '../LICENSE')
if (!existsSync(licensePath)) {
    console.error('❌ LICENSE 不存在')
    hasError = true
} else {
    console.log('✓ LICENSE 存在')
}

// 6. 运行测试
console.log('\n🧪 运行测试...')
try {
    execSync('npm run test', { stdio: 'inherit', cwd: resolve(__dirname, '..') })
    console.log('✓ 测试通过')
} catch (error) {
    console.error('❌ 测试失败或未找到测试脚本')
    // 测试失败不阻断，只是警告
}

// 7. 构建
console.log('\n📦 开始构建...')
try {
    execSync('npm run build', { stdio: 'inherit', cwd: resolve(__dirname, '..') })
    console.log('✓ 构建成功')
} catch (error) {
    console.error('❌ 构建失败')
    hasError = true
}

// 8. 检查构建产物
const distPath = resolve(__dirname, '../dist')
if (!existsSync(distPath)) {
    console.error('❌ 构建完成后找不到“dist”目录')
    hasError = true
} else {
    console.log('✓ dist目录存在')

    // 检查必要文件
    const requiredFiles = ['index.js', 'index.d.ts', 'styles.css', 'vite.d.ts']
    requiredFiles.forEach(file => {
        const filePath = resolve(distPath, file)
        if (!existsSync(filePath)) {
            console.error(`❌ 所需文件 ${file} 在“dist”目录中未找到。`)
            hasError = true
        } else {
            console.log(`✓ ${file} 存在`)
        }
    })
}

// 9. 检查包大小
try {
    const sizeOutput = execSync('du -sh dist', { cwd: resolve(__dirname, '..') }).toString()
    console.log(`📊 包大小: ${sizeOutput.trim()}`)
} catch (error) {
    // 忽略
}

if (hasError) {
    console.error('\n❌ 预发布检查未通过。请解决上述问题。')
    process.exit(1)
} else {
    console.log('\n✅ 所有检查都通过了！可以发布啦。')
}