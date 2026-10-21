import { execSync } from 'child_process'
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const packageJsonPath = resolve(__dirname, '../package.json')

// 获取参数
const type = process.argv[2] || 'patch'
const validTypes = ['patch', 'minor', 'major']

if (!validTypes.includes(type)) {
    console.error(`Invalid version type: ${type}. Use: patch, minor, major`)
    process.exit(1)
}

// 读取当前版本
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
const currentVersion = packageJson.version

// 计算新版本
const [major, minor, patch] = currentVersion.split('.').map(Number)
let newVersion

switch (type) {
    case 'patch':
        newVersion = `${major}.${minor}.${patch + 1}`
        break
    case 'minor':
        newVersion = `${major}.${minor + 1}.0`
        break
    case 'major':
        newVersion = `${major + 1}.0.0`
        break
}

console.log(`📦 Updating version from ${currentVersion} to ${newVersion}`)

// 更新 package.json
packageJson.version = newVersion
writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))

// 更新 CHANGELOG.md（简单实现）
const changelogPath = resolve(__dirname, '../CHANGELOG.md')
const today = new Date().toISOString().split('T')[0]
const changelogEntry = `\n## [${newVersion}] - ${today}\n\n### Added\n- \n\n### Changed\n- \n\n### Fixed\n- \n`

if (require('fs').existsSync(changelogPath)) {
    const currentChangelog = readFileSync(changelogPath, 'utf-8')
    writeFileSync(changelogPath, changelogEntry + currentChangelog)
}

// 创建 git tag
try {
    execSync(`git add ${packageJsonPath}`, { stdio: 'inherit' })
    execSync(`git commit -m "chore: release v${newVersion}"`, { stdio: 'inherit' })
    execSync(`git tag v${newVersion}`, { stdio: 'inherit' })
    console.log(`✓ Created git tag v${newVersion}`)
} catch (error) {
    console.warn('⚠️  Failed to create git tag (not in git repository)')
}

console.log(`\n✅ Version updated to ${newVersion}`)
console.log('\nNext steps:')
console.log(`  1. Review CHANGELOG.md`)
console.log(`  2. Run: npm publish`)
console.log(`  3. Run: git push && git push --tags`)