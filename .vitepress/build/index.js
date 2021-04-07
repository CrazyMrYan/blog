const type = 'dev'
export function Build(){
    return type === 'build' ? '/blog' : ''
}