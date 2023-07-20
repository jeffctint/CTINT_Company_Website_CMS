USE [gcti_ucs_db]
GO
/****** Object:  StoredProcedure [dbo].[get_interactions]    Script Date: 17/05/2023 22:45:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE OR ALTER      PROCEDURE [dbo].[get_interactions] (
	@search_input NVARCHAR(200) = null,
	@start_date DATETIME = null,
	@end_date DATETIME = null,
	@last_updated_agent_id NVARCHAR(100) = null,
	@email_status INT = null,
	@page_index INT = 0,
	@page_size INT = 100,
	@result_code int OUTPUT,
	@total_rows int output,
	@total_pages int output
)
AS
BEGIN
    SET NOCOUNT ON;
    SET @result_code = 0;

	DECLARE @temp TABLE (
        InteractionId NVARCHAR(max),
        AssignedQueue NVARCHAR(max),
        CaseId NVARCHAR(max),
        StartDate DATETIME,
        EndDate DATETIME,
        Subject NVARCHAR(max),
        ThreadId NVARCHAR(max),
        TypeId NVARCHAR(max),
        [Status] NVARCHAR(max),
        FromAddress NVARCHAR(max),
        ToAddresses NVARCHAR(max),
        ContainAttachment NVARCHAR(max),
		LastUpdatedAgent NVARCHAR(max)
    )

	-- Insert into temp table with data matching the WHERE clause
	INSERT INTO @temp (
		InteractionId,
		AssignedQueue,
		CaseId,
		StartDate,
		EndDate,
		Subject,
		ThreadId,
		TypeId,
		[Status],
		FromAddress,
		ToAddresses,
		ContainAttachment,
		LastUpdatedAgent
	)
	-- The main select statement
	SELECT
		interaction.Id AS InteractionId,
		interaction.StrAttribute1 AS AssignedQueue,
		interaction.StrAttribute3 AS CaseId,
		interaction.StartDate,
		interaction.EndDate,
		interaction.Subject,
		interaction.ThreadId,
		interaction.TypeId,
		CASE WHEN interaction.EndDate IS NULL THEN 'In progress' ELSE 'Done' END AS Status,
		eIn.FromAddress,
		eOut.ToAddresses,
		interaction.StrAttribute2 AS ContainAttachment,
		contact.StrAttribute1 + ' ' + contact.StrAttribute2 AS LastUpdatedAgent
	FROM [dbo].[Interaction] interaction
	LEFT OUTER JOIN [dbo].[EmailIn] eIn ON eIn.Id = interaction.Id
	LEFT OUTER JOIN [dbo].[EmailOut] eOut ON eOut.Id = interaction.Id
	INNER JOIN [dbo].[Contact] contact ON contact.Id = interaction.ContactId
	WHERE (@search_input is null OR
			-- case id
			interaction.StrAttribute3 LIKE '%' + ISNULL(@search_input, '') + '%'
			-- Sender address
			OR eIn.FromAddress LIKE '%' + ISNULL(@search_input, '') + '%'
			-- Receiver address
			OR eOut.ToAddresses LIKE '%' + ISNULL(@search_input, '') + '%'
			-- email subject
			OR interaction.Subject LIKE '%' + ISNULL(@search_input, '') + '%'
			-- interaction Id
			OR interaction.Id LIKE '%' + ISNULL(@search_input, '') + '%'
		)
		AND (@start_date IS NULL OR interaction.StartDate >= @start_date)
		AND (@end_date IS NULL OR interaction.StartDate <= @end_date)
		AND (@last_updated_agent_id IS NULL OR interaction.ContactId = @last_updated_agent_id)
		-- 2-In progress, 3-Done, null-return all
		AND (@email_status IS NULL OR interaction.Status = @email_status)
	ORDER BY interaction.StartDate DESC

	SET @total_rows = (SELECT COUNT(*) FROM @temp)

	-- Calculate the pageCount
	SET @total_pages = CEILING(CAST(@total_rows AS FLOAT) / @page_size)

	-- Adjust the page size if it exceeds the total number of rows and is not equal to 0
	IF @page_size > @total_rows and @total_rows != 0
	BEGIN
		SET @page_size = @total_rows
	END

	-- Select the data set with offset and fetch according to the pagination inputs
	SELECT
        *
    FROM
        @temp
    ORDER BY
        StartDate DESC
    OFFSET
        @page_index * @page_size ROWS
    FETCH NEXT
        @page_size ROWS ONLY;

	RETURN;
END;
