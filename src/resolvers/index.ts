
import { version as pkgVersion } from '../../package.json'

export interface UxWebResolverOptions {
    /**
   * import style css or sass with components
   *
   * @default 'css'
   */
    importStyle?: boolean | 'css' | 'sass'

    /**
     * specify element-plus version to load style
     *
     * @default installed version
     */
    version?: string

    /**
     * auto import for directives
     *
     * @default true
     */
    directives?: boolean

    /**
     * exclude component name, if match do not resolve the name
     */
    exclude?: RegExp

    /**
     * a list of component names that have no styles, so resolving their styles file should be prevented
     */
    noStylesComponents?: string[]
}

interface ComponentResolver {
    as?: string;
    name?: string;
    from: string;
}

const nameToLowerCase = (name: string) => name.replace(/([A-Z])/g, ' $1').trim().split(' ').join('-').toLowerCase()

const autoImports = [
    'uxUtils', 'uxVerify', 'uxCrypto', 'uxMaths',
    'uxModal', 'uxCached', 'uxRequest', 'uxComponent'
]

function resolveComponent(name: string, options: UxWebResolverOptions): ComponentResolver | undefined {
    if (options.exclude && name.match(options.exclude)) {
        return
    }

    if (/^ElIcon.+/.test(name)) {
        return {
            name: name.replace(/^ElIcon/, ''),
            from: '@element-plus/icons-vue',
        }
    }

    if (autoImports.includes(name)) {
        return {
            name,
            from: `ux-web`,
        }
    }

    if (nameToLowerCase(name).startsWith('ux-layout')) {
        return {
            name,
            from: `ux-web/layout`,
        }
    }
}

export const UxWebResolver = (options?: UxWebResolverOptions) => {

    let optionsResolved: UxWebResolverOptions

    const _options = () => {
        if (optionsResolved)
            return optionsResolved
        optionsResolved = {
            version: pkgVersion,
            importStyle: 'css',
            directives: true,
            exclude: undefined,
            noStylesComponents: options?.noStylesComponents || [],
            ...options,
        }
        return optionsResolved
    }

    return [
        {
            type: 'component' as 'component' | 'directive',
            resolve: (name: string) => {
                let options = _options()
                if (options.noStylesComponents?.includes(name)) {
                    options.importStyle = false
                }
                return resolveComponent(name, options)
            }
        }
    ]
}