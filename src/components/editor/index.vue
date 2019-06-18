<template>
    <div id="wangeditor">
        <div ref="editorElem" style="text-align:left"></div>
    </div>
</template>

<script>
import instance from '../../api/axiosUpload.js'
import E from 'wangeditor'
export default {
    name: 'editorElem',
    data () {
        return {
            editor: null,
            editorContent: ''
        }
    },
    props: ['catchData', 'content'], //接收父组件的方法
    watch: {
        content () {
            this.editor.txt.html(this.content)
        }
    },
    mounted () {
        this.editor = new E(this.$refs.editorElem)
        this.editor.customConfig.onchange = (html) => {
            this.editorContent = html
            this.catchData(this.editorContent) // 把这个html通过catchData的方法传入父组件
        }
        this.editor.customConfig.uploadImgServer = '/start/upload'
        //this.editor.customConfig.uploadFileName = '你自定义的文件名'
        this.editor.customConfig.menus = [
            'head',  // 标题
            'bold',  // 粗体
            'fontSize',  // 字号
            'fontName',  // 字体
            'italic',  // 斜体
            'underline',  // 下划线
            'strikeThrough',  // 删除线
            'foreColor',  // 文字颜色
            'backColor',  // 背景颜色
            'link',  // 插入链接
            'list',  // 列表
            'justify',  // 对齐方式
            'quote',  // 引用
            'emoticon',  // 表情
            'image',  // 插入图片
            'table',  // 表格
            'code',  // 插入代码
            'undo',  // 撤销
            'redo'  // 重复
        ]

        this.editor.customConfig.customUploadImg = function(files, insert) {

            var zy_Form = new FormData();
            for (var i = 0; i < files.length; i++) {
                zy_Form.append("pic", files[i]);
            }
            instance.post('/start/upload',zy_Form).then(function(response){
                console.log(response.data);
                insert(response.data.data);
            })
        }

        this.editor.create(); //创建富文本实例
        if (!this.content) {
            this.editor.txt.html('')
        }
    }
}
</script>

<style lang="scss" scoped>
    #wangeditor {
      width: 50rem;
    }
</style>
