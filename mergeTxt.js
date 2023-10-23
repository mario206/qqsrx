const fs = require('fs');
const path = require('path');
const glob = require('glob')
const Epub = require("epub-gen");

const main = async () => {
  console.log("main start")

  var output = "./锵锵三人行.txt"
  
  if(fs.existsSync(output)) {
    fs.unlinkSync(output)
  }

  const files = glob.sync("./**/*.txt")
  
  files.sort()

  console.log("files count: " + files.length)
  var content = ""

  var epubContents = []

  var mdDir = "./md";
  if(!fs.existsSync(mdDir)) {
    fs.mkdirSync(mdDir);
  }

  files.forEach((file)=>{
    var name = path.parse(file).name
    var str = fs.readFileSync(file,'utf8')

    var dst = []
    var lines = str.split('\n');
    lines = lines.splice(1);
    lines.forEach(line=>{
      var isMatch = /说话人 \d .*/g.exec(line)
      if(!isMatch) {
        dst.push(line)
      }
    })

    var str = dst.join('\n')
    str = "## " + name + "\n" + str;

    var epubData = ""
    dst.forEach(line=>{
      epubData += `<p>${line}</p>`
    })

    content += str;

    fs.writeFileSync(`./${mdDir}/${name}.md`,str,{flag:"w"})

    epubContents.push({title:name,author:"",data:epubData})
  })


  fs.writeFileSync(output,content);

  const option = {
    title: "锵锵三人行",
    author: "", 
    publisher: "",
    cover: "", // Url or File path, both ok.
    content: epubContents
};

  //new Epub(option, "./锵锵三人行.epub");

  console.log("main end")

};



main().catch((err) => console.error(err));