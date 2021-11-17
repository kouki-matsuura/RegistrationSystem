
    Vue.createApp({
        data: function(){
            return {
                absolute_subject_count: 0,
                AI_subject_count: 0,
                AII_subject_count: 0,
                C_subject_count: 0,
                delete_choice_subject: [],
                persona_data: '',
                subjects_data: '',
                subject_name: '',
                subjects : ["物理学の基礎", "情報科学基礎", "情報メディア実習", "数学の基礎1", "数学の基礎2",
                "生産活動と情報", "連続表現", "シミュレーション基礎演習", "線形代数学1", "情報と社会",
                "電気の基礎", "応用数理解析", "情報数学の基礎", "プログラミングJava3", "情報キャリアデザイン"],
                myTimetable: 
                [ 
                ['','','','',''],
                ['','','','',''],
                ['','','','',''],
                ['','','','',''],
                ['','','','',''],
                ],
            }
        },

        watch: {
            delete_choice_subject: {
                handler(newval,oldval) {
                    if (this.delete_choice_subject.length==0) {
                        $('#delete').addClass('d-none');
                    }else{
                        $('#delete').removeClass('d-none');
                    }
                },
                deep: true

            },
            
        },

        created() {
            axios.get('getSubjects')
            .then(response => 
            {this.subjects_data = response.data;})
                 
            axios.get("./ajax")
            .then(response => 
            {this.persona_data = response.data;
            this.getSutisfy()})
        },

        methods: {  
           getSutisfy: function() {
               this.persona_data.forEach((elem, index) => {
                html_str = ``;
                modal_str = ``;
                year = elem.学年;
                sex = elem.性別;
                var personal_datas = [elem.物理学の基礎, elem.情報科学基礎, elem.情報メディア実習, elem.数学の基礎1, elem.数学の基礎2,
                    elem.生産活動と情報, elem.連続表現, elem.シミュレーション基礎演習, elem.線形代数学1, elem.情報と社会,
                    elem.電気の基礎, elem.応用数理解析, elem.情報数学の基礎, elem.プログラミングJava3, elem.情報キャリアデザイン];
        
                for (var i=0; i<this.subjects.length; i++) {
                    if (personal_datas[i] != undefined) {                   
                        modal_str =`
                        <div class="row">
                        <div class="col-11 mb-2" style="font-size:20px; background-color: #ffdead"><strong>`+ this.subjects[i] +`</strong></div>
                        <div class="col-6 mb-1" style="background-color: beige"><strong>難易度</strong></div>
                        <div class="col-5 mb-1" style="background-color: beige">`+parseInt(personal_datas[i].難易度)+`</div>
                        <div class="col-6 mb-1"><strong>知識習得(情報工学)</strong></div>
                        <div class="col-5 mb-1" >`+parseInt(personal_datas[i].知識習得_情報工学)+`</div>
                        <div class="col-6 mb-1" style="background-color: beige"><strong>知識習得(プログラミング)</strong></div>
                        <div class="col-5 mb-1" style="background-color: beige">`+parseInt(personal_datas[i].知識習得_プログラミング)+`</div>
                        <div class="col-6 mb-1"><strong>知識習得(英語)</strong></div>
                        <div class="col-5 mb-1">`+parseInt(personal_datas[i].知識習得_英語)+`</div>
                        <div class="col-6 mb-1" style="background-color: beige"><strong>社会への学び</strong></div>
                        <div class="col-5 mb-1" style="background-color: beige">`+parseInt(personal_datas[i].社会への学び)+`</div>
                        <div class="col-6 mb-1"><strong>人間への学び</strong></div>
                        <div class="col-5 mb-1">`+parseInt(personal_datas[i].人間への学び)+`</div>
                        <div class="col-6 mb-1" style="background-color: beige"><strong>グループワークの多さ</strong></div>
                        <div class="col-5 mb-1" style="background-color: beige">`+parseInt(personal_datas[i].グループワークの多さ)+`</div>
                        <div class="col-6 mb-1"><strong>成績の付け方</strong></div>
                        <div class="col-5 mb-1">`+personal_datas[i].成績の付け方+`</div>
                        </div>
                        `;
                        
                        html_str += 
                        `
                        <div class="col-5 mb-3">`+this.subjects[i]+`</div>
                        <div class="col-4 mb-3" >`+parseInt(personal_datas[i].満足度)+`</div>
                        <div class="mb-3">
                        <button 
                        onclick="$('.`+this.subjects[i]+`-`+index+`').css('display','block')" 
                        type="button"  
                        class="btn btn-secondary" 
                        style="font-size: 8px"><i class="fas fa-info-circle"> 詳細</i></button>
                        </div>
                        <div class="`+this.subjects[i]+`-`+index+`" style="display:none; position:fixed; z-index:20; top:0; left:0; width:100%; height:100%;">
                            <div 
                            class="modalBg"
                            style= "width:100%; height:100%; background: rgba(30,30,30,0.9);"
                            onclick="$('.`+this.subjects[i]+`-`+index+`').css('display','none')"></div>
                            <div class="modalWrapper" style="position: absolute; top: 50%;
                            left: 50%; transform: translate(-50%, -50%); width: 100%;
                            max-width: 500px;height: 315px;padding: 10px 30px;
                            background: #fff;">
                                <div class="modalContents">`
                                + modal_str +
                                `</div>
                                <div 
                                class="closeModal" 
                                style="position: absolute;top: 0.5rem; right: 1rem;cursor: pointer;"
                                onclick="$('.`+this.subjects[i]+`-`+index+`').css('display','none')"><i class="far fa-times-circle"></i></div>
                            </div>
                        </div>
                        `;

                    };

                }
                switch (index) {
                    case 0:
                        $('#year1').html(year);
                        $('#sex1').html(sex);
                        $('#satisfy_data').html(html_str);
                        break;
                    case 1:
                        $('#year2').html(year);
                        $('#sex2').html(sex);
                        $('#satisfy_data2').html(html_str);
                        break;
                    case 2:
                        $('#year3').html(year);
                        $('#sex3').html(sex);
                        $('#satisfy_data3').html(html_str);
                        break;
                }
               });
            },

            getParam: function(name, url) {
                if (!url) url = window.location.href;
                name = name.replace(/[\[\]]/g, "\\$&");
                var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
                results = regex.exec(url)
                if(!results) return null;
                if(!results[2]) return '';
                return decodeURIComponent(results[2].replace(/\+/g, " "));
            },

            choiceSubject_inTable: function(mass) {
                if (mass === '') {
                    return false;
                }
                days = this.search_subjectday_inTable(mass);

                days.forEach(day => {
                    if ($('#'+day).hasClass('border')) {
                        $('#'+day).removeClass('border border-primary');
                        this.delete_choice_subject.splice($.inArray(day, this.delete_choice_subject), 1);
                        
                    }else{
                        $('#'+day).addClass('border border-primary');
                        this.delete_choice_subject.push(day);

                    }
                });        
                
                
            },

            choiceSubject_inNet: function() {
                if ($('#ネット講義').hasClass('border')) {
                    $('#ネット講義').removeClass('border border-primary');
                }else{
                    $('#ネット講義').addClass('border border-primary');
                    this.delete_choice_subject.push('ネット講義')
                }
            },

            setSubject: function(subjectName, subjectDays, kind){
                var backColor;
                var error = false;
                var unit = 2;
                
                if (subjectName === '情報メディア実習') {
                    unit = 1;
                }
                if (subjectDays !== 'ネット講義') {
                    subjectDays.split(',').forEach(day => {
                        dayNum = this.search_dayNum(day);
                        
                        if (this.myTimetable[Number(day.charAt(1))-1][dayNum] !== '') {
                            error = true;
                            $('#error').html(`<div class="btn-danger"><strong>「`+ day +`」は既に講義が入っています。</strong><div>`);
                        }
                    });

                }

                if (!error){
                    if (kind === 'absolute') {
                        backColor = 'rgb(194, 107, 162)';
                        this.absolute_subject_count += unit;
                    }else if (kind === 'AI') {
                        backColor = 'rgb(148, 196, 180)';
                        this.AI_subject_count += unit;
                    }else if (kind === 'AII') {
                        backColor = 'rgb(159, 140, 198)';
                        this.AII_subject_count += unit;
                    }else if (kind === 'C') {
                        backColor = 'moccasin';
                        this.C_subject_count += unit;
                    }

                    subjectDays.split(',').forEach(day => {
                        
                        if(day !== 'ネット講義') {
                            $('#'+day).css('background-color', backColor);
                            $('#'+day).addClass(subjectName);
                            this.myTimetable[Number(day.charAt(1))-1][dayNum] = subjectName;
                        }else{
                            $('#ネット講義').append(`
                            <div class="col-12 `+ subjectName +`" style="background-color:`+ backColor +`">
                            `+subjectName+`
                            </div>`
                            )
                        }
                        
                    });
                    $('#error').html(`<div>なし<div>`);
                };
            },

            deleteSubject: function() {
                var str_subjectname='';
                delete_choice_subjectLen = this.delete_choice_subject.length
                for(var i=0; i<delete_choice_subjectLen; i++) {
                    subject_day = this.delete_choice_subject.shift();
                    subject_kind = $('#'+subject_day).css('background-color');
                    $('#'+subject_day).css('background-color', '');
                    $('#'+subject_day).removeClass('border border-primary');
                    if (subject_day !== 'ネット講義'){
                        this.search_subjectname_inTable(subject_day);
                        $('#'+subject_day).removeClass(this.subject_name);
                        dayNum = this.search_dayNum(subject_day.charAt(0));
                        this.myTimetable[Number(subject_day.charAt(1))-1][dayNum] = '';
                    }else{
                        $('#ネット講義').html('');
                        this.AII_subject_count -= 2;
                    }
                    if (str_subjectname != this.subject_name) {
                        switch (subject_kind) {
                            case 'rgb(194, 107, 162)':
                                this.absolute_subject_count -= 2;
                                break;
                            case 'rgb(148, 196, 180)':
                                this.AI_subject_count -= 2;
                                break;
                            case 'rgb(159, 140, 198)':
                                this.AII_subject_count -= 2;
                                break;
                            case 'rgb(255, 228, 181)':
                                this.C_subject_count -= 1;
                                break;
                            
                        }
                    }
                    str_subjectname = this.subject_name;
                };
                
                
            },

            search_subjectday_inTable: function(subject) {
                result = [];
                $('#timeTable').find('.'+subject).each(function(){
                   result.push($(this).attr('id'));
                })
                return result;
            },

            search_subjectname_inTable: function(day) {
               clasies =  $('#timeTable').find('#'+ day).attr('class');
               clasies.split(' ').forEach(ele => {
                for (var i=0; i<ele.length; i++) {
                    if (ele.charCodeAt(i) >= 256) {
                        this.subject_name = ele;
                    } 
                }
            
               })
                
            },

            search_dayNum: function(day) {
                if (day.charAt(0)==='月') dayNum = 0;
                if (day.charAt(0)==='火') dayNum = 1;
                if (day.charAt(0)==='水') dayNum = 2;
                if (day.charAt(0)==='木') dayNum = 3;
                if (day.charAt(0)==='金') dayNum = 4;
                if (day.charAt(0)==='土') dayNum = 5;
                return  dayNum;
            },

            save: function() {
                result_html = $('#timeTable_all').html();
                $('#result').html(result_html);
                $('#result_modal').css('display','block');
            },

            retry: function() {
                $('#result_modal').css('display','none');
            },

            complete: function() {
                window.location.href= "https://docs.google.com/forms/d/e/1FAIpQLSd5KdsW8dMhcqUAGTVIVy2wjbZZZIOd86syG-kgC61C8tOEHA/viewform?usp=sf_link";
            }
        },

        mounted() {
            $('.monday').each(function(i){
                $(this).attr('id', '月'+(i+1));
            });
            $('.thuesday').each(function(i){
                $(this).attr('id', '火'+(i+1));
            });
            $('.wednesday').each(function(i){
                $(this).attr('id', '水'+(i+1));
            });
            $('.thirsday').each(function(i){
                $(this).attr('id', '木'+(i+1));
            });
            $('.friday').each(function(i){
                $(this).attr('id', '金'+(i+1));
            });
            $('.saturday').each(function(i){
                $(this).attr('id', '土'+(i+1));
            });
            
        },

        delimiters : ['[[',']]']
    }).mount("#counter")
