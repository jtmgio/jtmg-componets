//NG Imports
import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy, ViewChild, Inject } from "@angular/core";
import { PageEvent } from "@angular/material";
import { AppService } from "../../../app.service";
import { ijtmgioTable, iColumns, jtmgioPaginator, jtmgioClientDataSource, jtmgioTable, MatSort, MatTable } from "../../../components/table/public-api";
import { TablesService } from "../tables.service";
@Component({
	selector: 'jtmgio-tables',
	template: `
	<div><h1>Client Paging Table</h1></div>
	<jtmgio-table-header (onChildFilterEvent)="onFilter( $event )" [searchPlaceholder]="'This is a placeholder'" [hasFilter]="true" [filterOnKeyUp]="false" >
		<ng-container table-header>
			<div class="flex">
			</div>
		</ng-container>
	</jtmgio-table-header>
		<jtmgio-table-wrapper>
			<ng-container table-body>
				<mat-table #table [dataSource]="dataSource" matSort>
					<ng-container matColumnDef="first_name">
						<mat-header-cell *matHeaderCellDef mat-sort-header>
							First Name
						</mat-header-cell>
						<mat-cell *matCellDef="let row"> 
							{{ row.first_name }} 
						</mat-cell>
					</ng-container>
					<ng-container matColumnDef="last_name">
						<mat-header-cell *matHeaderCellDef mat-sort-header>
							Last Name
						</mat-header-cell>
						<mat-cell *matCellDef="let row"> 
							{{ row.last_name }} 
						</mat-cell>
					</ng-container>
					<ng-container matColumnDef="status">
					<mat-header-cell *matHeaderCellDef mat-sort-header>
						Status
					</mat-header-cell>
					<mat-cell *matCellDef="let row"> 
					<jtmgio-status-pill [statusId]="row.status" [disabledSelect]="disabledList"[status]="dataTableStatus" (updateStatus)="putStatus($event,row.memberTypeId)"></jtmgio-status-pill>
					</mat-cell>
				</ng-container>
					<mat-header-row *matHeaderRowDef="columns"></mat-header-row>
					<mat-row *matRowDef="let row; columns: columns"></mat-row>			
				</mat-table>
				<jtmgio-paginator #paginator
					[length]="dataSource.resultsLength"
					[pageIndex]="pageIndex"
					[pageSize]="pageSize"
					[pagerLabel]="pagerLabel"
					[moduleName]="moduleName"
					[useCaching]="useCaching"
					(page)="listenPageEvents($event)"
					[pageSizeOptions]="pageSizeOptions">
				</jtmgio-paginator>
			</ng-container>
		</jtmgio-table-wrapper>
	`
})

export class TableClientComponent implements OnInit, OnChanges, ijtmgioTable {
	public columns: string[] = ['first_name', 'last_name'];
	public columnDefinitions: iColumns[] = [
		{ name: "first_name", canFilter: true, canSort: true, type: "string", searchable: true },
		{ name: "last_name", canFilter: true, canSort: true, type: "string", searchable: true }
	];

	//holder of the table data
	public tableData: any[] = [];
	public dataSource: jtmgioClientDataSource | null;
	//page index
	public pageIndex: number = 0;
	//default page size
	public pageSize: number = 10;
	//the per page options
	public pageSizeOptions: number[] = [5, 10, 15, 25];
	//The pager label
	public pagerLabel: string = "Group List Count:";
	//PageEvent see listenPageEvents
	public pageEvent: PageEvent;

	//The below is used for caching
	public moduleName: string = "testModule";
	public useCaching: boolean = true;

	//access our child componnents
	@ViewChild(jtmgioPaginator) paginator: jtmgioPaginator;
	@ViewChild(MatSort) sort: MatSort;

	//our filter
	@Input() filter: string;


	/*
	**-------------------------------------------------------------------------------------
	** METHOD NAME - constructor
	**-------------------------------------------------------------------------------------
	*/
	constructor(
		private service: AppService,
		private tableService: TablesService
	) { }
	/*
	**-------------------------------------------------------------------------------------
	** METHOD NAME - ngOnInit
	**-------------------------------------------------------------------------------------
	*/
	ngOnInit() {
		//initialize table
		//in a normal case you would load the data then initialize the component, this is 
		//more of a test case
		this.renderTable();
		//get server call to table data
		this.tableService.getListClient().subscribe((ret) => {
			this.tableData = ret.list;
			//retnder table
			this.renderTable();
		});
	}
	/*
	**-------------------------------------------------------------------------------------
	** METHOD NAME - ngOnDestroy
	**-------------------------------------------------------------------------------------
	*/
	ngOnDestroy() {
		this.dataSource.disconnect();
	}
	/*
	**-------------------------------------------------------------------------------------
	** METHOD NAME - renderTable
	**-------------------------------------------------------------------------------------
	*/
	renderTable() {
		//if you want to start on a specific page
		this.dataSource = new jtmgioClientDataSource(
			this.tableData,
			this.paginator,
			this.sort,
			this.columnDefinitions
		);
	}
	/*
	**-------------------------------------------------------------------------------------
	** METHOD NAME - onFilter
	**-------------------------------------------------------------------------------------
	*/
	onFilter(filter: string) {
		this.dataSource.filter = filter;
	}
	/*
	**-------------------------------------------------------------------------------------
	** METHOD NAME - ngOnChanges
	**-------------------------------------------------------------------------------------
	*/
	ngOnChanges(changes: SimpleChanges) {
	}
	/*
	**-------------------------------------------------------------------------------------
	** METHOD NAME - listenPageEvents
	**-------------------------------------------------------------------------------------
	*/
	listenPageEvents(event) {
		console.log(event);
	}
}
