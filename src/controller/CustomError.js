class CustomError extends Error{
  constructor(code, name, desc){
    super(desc)
    this.name=name
    this.code = code
  }
}

module.exports = CustomError