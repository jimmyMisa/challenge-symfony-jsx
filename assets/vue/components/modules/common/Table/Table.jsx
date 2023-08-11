import "./Table.scss?module";
class Table{
	static getMethods(){
		return {
			renderTable(){
				return (
					<div>
						{this.renderTableTop()}
						<table class="table">
							<thead>
								{this.renderTableHead()}
							</thead>
							<tbody>
								{this.renderTableBody()}
							</tbody>
						</table>
						{this.renderTableBottom()}
					</div>
				)
			},
			renderTableGlobalActions(){
				return null;
			},
			renderTablePageSize(){
				return null;
			},
			renderTableSearch(){
				return null;
			},
			renderTableTop(){
				return (
					<div>
						{this.renderTableGlobalActions()}
						{this.renderTablePageSize()}
						{this.renderTableSearch()}
					</div>
				)
			},
			renderTableHead(){
				var {fields = []} = this.config;
				return (
					<tr>{
						fields.map((field, index) =>{
							if(this.renderTableHeadField){
								return this.renderTableHeadField(field, index)
							}
							return (
								<th>
									{field}
								</th>
							)
						})
					}
					{(() =>{
						if(!this.tableWithAction()){
							return null
						}
						if(this.renderTableHeadAction){
							return this.renderTableHeadAction(line)
						}
						return (
							<th>
								Actions
							</th>
						)
					})()}
					</tr>
				)
			},
			tableEmptyData(){
				var {fields = []} = this.config;
				var colspan = fields.length
				if(this.tableWithAction()){
					colspan = colspan + 1;
				}
				return (
					<tr>
						<td colspan={colspan}>Aucun resultat</td>
					</tr>
				)
			},
			renderTableBody(){
				var {data = []} = this.config;
				var {fields = []} = this.config;
				if(!data.length){
					return this.tableEmptyData();
				}
				return data.map((line, index) =>{
					return (
						<tr>
							{fields.map((field) =>{
								var value = line[field]
								if(this.renderTableBodyValue){
									return this.renderTableBodyValue(value, line, field)
								}
								return (
									<td>
										{value}
									</td>
								)
							})}
							{(() =>{
								if(!this.tableWithAction()){
									return null
								}
								if(this.renderTableBodyAction){
									return this.renderTableBodyAction({line,index})
								}
								return (
									<td>
										<button type="button" onClick={this.tableEvent("Edit", {line, index})}>
											Modifier
										</button>
										<button type="button" onClick={this.tableEvent("Remove", {line, index})}>
											Supprimer
										</button>
									</td>
								)
							})()}
						</tr>
					)
				})
			},
			renderTablePagination(){
				//Override or inherit as PaginatedTable
				return null
			},
			renderTableBottom(){
				return (
					<div>
						{this.renderTablePagination()}
					</div>
				)
			},
			tableEvent(key, params = {}){
				if(
					this[`tableEvent${key}`] &&
					this[`tableEvent${key}`](params) &&
					typeof this[`tableEvent${key}`](params) == "function"
				){
					return this[`tableEvent${key}`](params);
				}
				return () =>{}
			},
			tableWithAction(){
				return true;
			}
		}
	}
}

export {
	Table
}