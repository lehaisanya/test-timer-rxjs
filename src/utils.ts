const fill2char = (str: string) => {
    return str.length < 2 ? '0' + str : str
}

export const formatTime = (time: number): string => {
    const seconds = fill2char(`${time % 60}`)
    const timeWithoutSeconds = Math.floor(time / 60)
    const minuts = fill2char(`${timeWithoutSeconds % 60}`)
    const hours = fill2char(`${Math.floor(timeWithoutSeconds / 60)}`)
    
    return `${hours} : ${minuts} : ${seconds}`
}
