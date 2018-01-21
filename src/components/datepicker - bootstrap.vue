<template>
	<div>
		<div class="container">
			<div class="row">
				<div class='col-sm-6'>
					<div class="form-group">
						<div class='input-group date' id='datetimepicker1' @click="changeDate">
							<input type='text' class="form-control" />
							<span class="input-group-addon">
								<span class="glyphicon glyphicon-calendar"></span>
							</span>
						</div>
					</div>
				</div>
    		</div>
		</div>
	</div>
</template>

<script>

	export default {
		name: 'datepicker',
		methods: {
			changeDate () {
				var currentDate = $('#datetimepicker1').datetimepicker();
				console.log("Date: " + currentDate)
			}
		}
	}
</script>

<style>

</style>