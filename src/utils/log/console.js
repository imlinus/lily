const console = log => {
  if (!Lily.prototype.config.silent) {
    console.log(`🌷 ${log}`)
  }
}

export default console
