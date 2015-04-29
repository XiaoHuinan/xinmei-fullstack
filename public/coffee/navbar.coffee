$ ->
	console.log 'compile navbar coffee success'
	apiBaseUri = '/v1/api'
	# 搜索框的ajax请求，包括进度条功能
	$('#search-btn').click(()->
		searchval = $('#searchval').val();
		time = null
		percent = 0
		$('.search-result').show()
		$('.search-progress>.progress-bar').attr('style', "width: 0%")

		$.ajax({
			method: 'get',
			url: "#{apiBaseUri}/search?enterprise=#{searchval}",
			beforeSend: ()->
				# 用来显示进度条的时间
				$('.search-progress').show()
				time = setInterval(()->
					$('.search-progress>.progress-bar').attr('style', "width: #{percent+=2}%")

				500)
			,
			success: (result)->
				postTemplate = JST['public/templates/search-results.handlebars']
				html = postTemplate(result)
				$('#search-list').html(html)
				# 给动态的元素添加事件
				bindLoadFuc();
			,
			complete: ()->
				clearInterval(time)
				$('.search-progress>.progress-bar').attr('style', "width: 100%")
				setTimeout(()->
					$('.search-progress').hide()
				500)
		})	
	)
	# 搜索结果框的关闭功能
	$('#close-search-btn').click(()->
		$('.search-result').hide()
	)

	bindLoadFuc = ()->
		# 表格里面loaddata按钮功能
		$('.loaddata-btn').on('click', ()->
			# enterprise = $(this).data('enterprise')
			# status = $(this).data('status')
			lcid = $(this).data('lcid')
			# 开始请求接口抓取数据
			$('#beginload-btn').on("click", ()->
				time = null
				percent = 0
				$('.loaddata-result').show()
				$('.loaddata-progress>.progress-bar').attr('style', "width: 0%")
				$.ajax({
					type: 'POST',
					url: "#{apiBaseUri}/loadqydata",
					data:
						lcid: lcid
					,
					beforeSend: ()->
						# 用来显示进度条的时间
						$('.loaddata-progress').show()
						time = setInterval(()->
							$('.loaddata-progress>.progress-bar').attr('style', "width: #{percent+=1}%")

						500)
					,
					success: (result)->
						result.lcid = lcid;
						postTemplate = JST['public/templates/modal-result.handlebars']
						html = postTemplate(result)
						$('#modal-result').html(html)
					,
					complete: ()->
						clearInterval(time)
						$('.loaddata-progress>.progress-bar').attr('style', "width: 100%")
						setTimeout(()->
							$('.loaddata-progress').hide()
						500)

				})
			)
		)














